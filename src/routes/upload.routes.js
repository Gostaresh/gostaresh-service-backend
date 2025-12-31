"use strict";

const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");
const { createRateLimiter } = require("@/middlewares/rate_limit");
const {
  sanitizePathSegments,
  ensureDirSync,
  buildFilename,
  resolveUnderUploadsFromPath,
  isInsideUploads,
  getUploadsRoot,
} = require("@/utils/file");
const fs = require("fs");
const fsp = require("fs/promises");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rawScope = req.body.scope || req.query.scope || "misc";
    const safeScope = sanitizePathSegments(rawScope);
    const dest = path.join(process.cwd(), "uploads", safeScope);
    try {
      ensureDirSync(dest);
    } catch (e) {
      return cb(e);
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const partial = req.body.partialName || req.query.partialName || file.originalname;
    const name = buildFilename(partial, file.originalname);
    cb(null, name);
  },
});

const MAX_SIZE_MB = parseInt(process.env.UPLOAD_MAX_SIZE_MB || "10", 10);
const uploadLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || "20", 10),
  message: "Too many uploads, please try again later.",
  keyGenerator: (req) => req.auth?.sub || req.ip,
});
const deleteLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX || "20", 10),
  message: "Too many delete requests, please try again later.",
  keyGenerator: (req) => req.auth?.sub || req.ip,
});
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ].includes(file.mimetype);
    if (!ok) return cb(new Error("Invalid file type"));
    cb(null, true);
  },
});

// Single file upload: field name "file"
router.post(
  "/upload",
  authenticate,
  authorizePermissions("file.upload"),
  uploadLimiter,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const rawScope = req.body.scope || req.query.scope || "misc";
      const safeScope = sanitizePathSegments(rawScope);
      const relPath = ["/uploads", safeScope, req.file.filename]
        .filter(Boolean)
        .join("/")
        .replace(/\\/g, "/");

      return res.status(201).json({
        path: relPath,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
    } catch (err) {
      next(err);
    }
});

// Multiple files upload: field name "files"
router.post(
  "/upload/multi",
  authenticate,
  authorizePermissions("file.upload"),
  uploadLimiter,
  upload.array("files"),
  async (req, res, next) => {
    try {
      const rawScope = req.body.scope || req.query.scope || "misc";
      const safeScope = sanitizePathSegments(rawScope);
      const files = (req.files || []).map((f) => ({
        path: ["/uploads", safeScope, f.filename]
          .filter(Boolean)
          .join("/")
          .replace(/\\/g, "/"),
        fileName: f.filename,
        originalName: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
      }));
      if (files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      return res.status(201).json({ files });
    } catch (err) {
      next(err);
    }
});

// Delete a single file
router.delete(
  "/delete",
  authenticate,
  authorizePermissions("file.delete"),
  deleteLimiter,
  async (req, res, next) => {
    try {
      const filePath = req.body?.path || req.query?.path;
      let abs;
      if (filePath) {
        abs = resolveUnderUploadsFromPath(filePath);
      } else {
        const scope = req.body?.scope || req.query?.scope;
        const fileName = req.body?.fileName || req.query?.fileName;
        if (!scope || !fileName) {
          return res.status(400).json({
            message: "Provide either 'path' or both 'scope' and 'fileName'",
          });
        }
        const safeRel = sanitizePathSegments(scope + "/" + fileName);
        abs = resolveUnderUploadsFromPath(safeRel);
      }

      if (!isInsideUploads(abs)) {
        return res.status(400).json({ message: "Invalid path" });
      }

      if (!fs.existsSync(abs)) {
        return res.status(404).json({ message: "File not found" });
      }

      await fsp.unlink(abs);
      return res.json({
        message: "Deleted",
        path: (req.body?.path || req.query?.path) || null,
      });
    } catch (err) {
      next(err);
    }
});

// Delete a whole scope directory (e.g., products/123)
router.delete(
  "/delete-scope",
  authenticate,
  authorizePermissions("file.delete"),
  deleteLimiter,
  async (req, res, next) => {
    try {
      const scope = req.body?.scope || req.query?.scope;
      if (!scope) {
        return res.status(400).json({ message: "'scope' is required" });
      }
      const safeScope = sanitizePathSegments(scope);
      const dirAbs = resolveUnderUploadsFromPath(safeScope);
      if (!isInsideUploads(dirAbs)) {
        return res.status(400).json({ message: "Invalid scope" });
      }
      // Do not allow deleting the uploads root itself
      if (path.resolve(dirAbs) === path.resolve(getUploadsRoot())) {
        return res
          .status(400)
          .json({ message: "Refusing to delete uploads root" });
      }

      // Remove directory recursively if exists
      try {
        await fsp.rm(dirAbs, { recursive: true, force: true });
      } catch (e) {
        // Fallback for very old Node if rm is not supported
        const entries = await fsp
          .readdir(dirAbs, { withFileTypes: true })
          .catch(() => []);
        await Promise.all(
          entries.map((ent) => {
            const target = path.join(dirAbs, ent.name);
            return ent.isDirectory()
              ? fsp.rm(target, { recursive: true, force: true }).catch(() => {})
              : fsp.unlink(target).catch(() => {});
          })
        );
        await fsp.rmdir(dirAbs).catch(() => {});
      }

      return res.json({ message: "Scope deleted", scope: safeScope });
    } catch (err) {
      next(err);
    }
});

module.exports = router;
