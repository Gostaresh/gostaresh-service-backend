"use strict";

const AdminJS = require("adminjs");
const AdminJSSequelize = require("@adminjs/sequelize");
const crypto = require("crypto");
const db = require("../models");

AdminJS.registerAdapter({ Database: AdminJSSequelize.Database, Resource: AdminJSSequelize.Resource });

async function setupAdmin(app) {
  const { default: AdminJSExpress } = await import("@adminjs/express");

  const admin = new AdminJS({
    databases: [db.sequelize],
    rootPath: "/admin",
    branding: { companyName: "Gostaresh Admin" },
  });

  const authenticate = async (email, password) => {
    const u = await db.user.findOne({ where: { userName: email } });
    if (!u) return null;
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    if (u.password !== hash) return null;
    const roles = (await u.getRoles?.({ joinTableAttributes: [] })) || [];
    const isSuperAdmin = roles.some((r) => String(r.name || "").toLowerCase() === "superadmin");
    return isSuperAdmin ? { email: u.userName, id: u.id } : null;
  };

  const cookiePassword = process.env.ADMINJS_COOKIE_SECRET || "change-me";

  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    { authenticate, cookiePassword },
    null,
    {
      resave: false,
      saveUninitialized: true,
      secret: cookiePassword,
    }
  );

  app.use(admin.options.rootPath, router);
}

module.exports = { setupAdmin };
