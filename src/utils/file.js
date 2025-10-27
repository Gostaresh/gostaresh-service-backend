"use strict";

const path = require("path");
const fs = require("fs");

function toSafeSegment(input) {
  if (!input) return "";
  return String(input)
    .normalize("NFKD")
    .replace(/[^\w\-\s/]+/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

function sanitizePathSegments(raw) {
  const parts = String(raw || "")
    .split("/")
    .map((seg) => toSafeSegment(seg))
    .filter(Boolean);
  return parts.join(path.sep);
}

function ensureDirSync(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function buildFilename(partialName, originalName) {
  const base = toSafeSegment(partialName) || toSafeSegment(path.parse(originalName || "file").name) || "file";
  const ts = Date.now();
  const ext = path.extname(originalName || "");
  return `${base}-${ts}${ext}`;
}

module.exports = {
  toSafeSegment,
  sanitizePathSegments,
  ensureDirSync,
  buildFilename,
};

// Uploads root helpers and safe resolution
const uploadsRoot = path.join(process.cwd(), "uploads");

function getUploadsRoot() {
  return uploadsRoot;
}

function resolveUnderUploadsFromPath(inputPath) {
  const raw = String(inputPath || "");
  let stripped = raw.replace(/^\\+|^\/+/, "");
  if (stripped.toLowerCase().startsWith("uploads/")) {
    stripped = stripped.slice("uploads/".length);
  }
  if (stripped.toLowerCase().startsWith("uploads\\")) {
    stripped = stripped.slice("uploads\\".length);
  }
  const safeRel = sanitizePathSegments(stripped);
  const abs = path.join(uploadsRoot, safeRel);
  return abs;
}

function isInsideUploads(absPath) {
  const root = path.resolve(uploadsRoot);
  const target = path.resolve(absPath || "");
  return target === root || target.startsWith(root + path.sep);
}

module.exports.getUploadsRoot = getUploadsRoot;
module.exports.resolveUnderUploadsFromPath = resolveUnderUploadsFromPath;
module.exports.isInsideUploads = isInsideUploads;
