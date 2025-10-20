"use strict";

const jwt = require("jsonwebtoken");
const { user, role, permission } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function loadUserWithPermissions(userId) {
  const u = await user.findByPk(userId, {
    include: [
      {
        model: role,
        as: "roles",
        through: { attributes: [] },
        include: [
          {
            model: permission,
            as: "permissions",
            through: { attributes: [] },
          },
        ],
      },
    ],
  });
  if (!u) return null;
  const perms = new Set();
  const rolesSet = new Set();
  for (const r of u.roles || []) {
    if (r.name) rolesSet.add(r.name);
    for (const p of r.permissions || []) {
      if (p.name) perms.add(p.name);
    }
  }
  return { instance: u, permissions: perms, roles: rolesSet };
}

function authenticate(req, res, next) {
  try {
    const header = req.headers["authorization"] || "";
    const token = header.startsWith("Bearer ") ? header.substring(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = { sub: decoded.sub, roles: decoded.roles || [], perms: new Set(decoded.perms || []) };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function authorizePermissions(...required) {
  return async (req, res, next) => {
    try {
      if (!req.auth?.sub) return res.status(401).json({ message: "Unauthorized" });

      // If token already has perms/roles, use them; otherwise load from DB
      let perms = req.auth.perms;
      let roles = new Set(req.auth.roles || []);
      if (!perms || perms.size === 0) {
        const loaded = await loadUserWithPermissions(req.auth.sub);
        if (!loaded) return res.status(401).json({ message: "Unauthorized" });
        perms = loaded.permissions;
        roles = loaded.roles || new Set();
      }

      // superadmin bypass
      if (roles && (roles.has("superadmin") || roles.has("SuperAdmin"))) {
        return next();
      }

      const ok = required.length === 0 || required.some((name) => perms.has(name));
      if (!ok) return res.status(403).json({ message: "Forbidden" });
      next();
    } catch (err) {
      next(err);
    }
  };
}

function authorizeRoles(...rolesRequired) {
  return async (req, res, next) => {
    try {
      if (!req.auth?.sub) return res.status(401).json({ message: "Unauthorized" });

      // Load roles if not present on token
      let roles = new Set(req.auth.roles || []);
      if (!roles || roles.size === 0) {
        const loaded = await loadUserWithPermissions(req.auth.sub);
        if (!loaded) return res.status(401).json({ message: "Unauthorized" });
        roles = loaded.roles || new Set();
      }

      // superadmin bypass
      if (roles.has("superadmin") || roles.has("SuperAdmin")) return next();

      const ok = rolesRequired.length === 0 || rolesRequired.some((r) => roles.has(r));
      if (!ok) return res.status(403).json({ message: "Forbidden" });
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  signToken,
  authenticate,
  authorizePermissions,
  authorizeRoles,
};
