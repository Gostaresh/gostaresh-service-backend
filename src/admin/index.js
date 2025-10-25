"use strict";

const crypto = require("crypto");
const db = require("../models");
const helmet = require("helmet");

async function setupAdmin(app) {
  const { default: AdminJS } = await import("adminjs");
  const { default: AdminJSSequelize } = await import("@adminjs/sequelize");
  const { default: AdminJSExpress } = await import("@adminjs/express");

  AdminJS.registerAdapter({
    Database: AdminJSSequelize.Database,
    Resource: AdminJSSequelize.Resource,
  });

  const admin = new AdminJS({
    databases: [db.sequelize],
    rootPath: "/admin",
    branding: { companyName: "Gostaresh Admin" },
  });

  // Important: do NOT attach body parsers before AdminJS router.
  // AdminJS uses express-formidable internally and will throw OldBodyParserUsedError
  // if req._body is already set.

  // Relax CSP only for AdminJS routes so its inline scripts/styles can run
  app.use(admin.options.rootPath, helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    originAgentCluster: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'", "https:"],
        "font-src": ["'self'", "data:", "https:"],
        "img-src": ["'self'", "data:", "blob:", "https:"],
        "connect-src": ["'self'", "ws:", "wss:"],
        "frame-src": ["'self'"],
        // Prevent browser from auto-upgrading asset URLs to HTTPS on HTTP hosts
        "upgrade-insecure-requests": null,
      },
    },
  }));

  // Trace incoming AdminJS requests to confirm they reach the server
  app.use(admin.options.rootPath, (req, _res, next) => {
    // eslint-disable-next-line no-console
    console.log(`[AdminJS trace] ${req.method} ${req.originalUrl}`);
    next();
  });

  const authenticate = async (email, password) => {
    // Basic debug to help diagnose login issues (does not log password)
    // eslint-disable-next-line no-console
    console.log("[AdminJS] Login attempt", { email });
    const u = await db.user.findOne({ where: { userName: email } });
    if (!u) {
      console.warn("[AdminJS] user not found", { email });
      return null;
    }
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    if (u.password !== hash) {
      console.warn("[AdminJS] password mismatch for", { email });
      return null;
    }
    const roles = (await u.getRoles?.({ joinTableAttributes: [] })) || [];
    const roleNames = roles.map((r) => String(r.name || "").toLowerCase());
    const isSuperAdmin = roleNames.includes("superadmin");
    if (!isSuperAdmin) {
      if (process.env.ADMINJS_IGNORE_ROLE_CHECK === "true") {
        console.warn("[AdminJS] bypassing role check due to ADMINJS_IGNORE_ROLE_CHECK=true");
        return { email: u.userName, id: u.id };
      }
      console.warn("[AdminJS] user not superadmin", { email, roles: roleNames });
      return null;
    }
    return { email: u.userName, id: u.id };
  };

  const cookiePassword = process.env.ADMINJS_COOKIE_SECRET || "change-me";

  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    { authenticate, cookiePassword, cookieName: "adminjs" },
    null,
    {
      resave: false,
      saveUninitialized: true,
      secret: cookiePassword,
      cookie: {
        secure: false,
        sameSite: "lax",
      },
    }
  );

  app.use(admin.options.rootPath, router);
}

module.exports = { setupAdmin };
