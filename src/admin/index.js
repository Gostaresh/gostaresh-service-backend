"use strict";

const crypto = require("crypto");
const db = require("../models");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const faTranslations = require("./i18n/fa.json");

async function setupAdmin(app) {
  const { default: AdminJS } = await import("adminjs");
  const { default: AdminJSSequelize } = await import("@adminjs/sequelize");
  const { default: AdminJSExpress } = await import("@adminjs/express");

  AdminJS.registerAdapter({
    Database: AdminJSSequelize.Database,
    Resource: AdminJSSequelize.Resource,
  });

  const contentMenu = { name: "محتوا", icon: "Document" };
  const productMenu = { name: "محصولات", icon: "Package" };

  const admin = new AdminJS({
    // Scope only the requested resources; hide the rest by not registering them
    resources: [
      { resource: db.article_type, options: { navigation: contentMenu } },
      { resource: db.article, options: { navigation: contentMenu } },
      { resource: db.brand, options: { navigation: productMenu } },
      { resource: db.category, options: { navigation: productMenu } },
      { resource: db.gallery, options: { navigation: productMenu } },
      { resource: db.product, options: { navigation: productMenu } },
      { resource: db.product_status, options: { navigation: productMenu } },
    ],
    rootPath: "/admin",
    branding: { companyName: "گسترش ادمین" },
    locale: {
      language: "fa",
      availableLanguages: ["fa", "en"],
      translations: {
        labels: {
          login: "ورود",
          Dashboard: "داشبورد",
          navigation: "منو",
          Resources: "منابع",
          Users: "کاربران",
          محتوا: "محتوا",
          محصولات: "محصولات",
        },
        actions: {
          new: "ایجاد",
          edit: "ویرایش",
          show: "نمایش",
          list: "فهرست",
          delete: "حذف",
          search: "جستجو",
          bulkDelete: "حذف گروهی",
          export: "خروجی",
          filter: "فیلتر",
        },
        resources: {
          article: { name: "مقالات" },
          article_type: { name: "انواع مقاله" },
          brand: { name: "برندها" },
          category: { name: "دسته‌بندی‌ها" },
          gallery: { name: "گالری" },
          product: { name: "محصولات" },
          product_status: { name: "وضعیت‌های محصول" },
        },
      },
    },
  });

  // Load external Persian translation JSON and override locale
  try {
    const pkgPath = require.resolve("adminjs/package.json");
    const pkgDir = path.dirname(pkgPath);
    const candidates = [
      path.join(pkgDir, "src/locale/fa/translation.json"),
      path.join(pkgDir, "lib/locale/fa/translation.json"),
      path.join(pkgDir, "dist/locale/fa/translation.json"),
    ];
    const found = candidates.find((p) => fs.existsSync(p));
    if (found) {
      const base = JSON.parse(fs.readFileSync(found, "utf8"));
      const merged = {
        ...base,
        resources: {
          ...(base.resources || {}),
          article: { ...(base.resources?.article || {}), name: "مقالات" },
          article_type: {
            ...(base.resources?.article_type || {}),
            name: "انواع مقاله",
          },
          brand: { ...(base.resources?.brand || {}), name: "برندها" },
          category: {
            ...(base.resources?.category || {}),
            name: "دسته‌بندی‌ها",
          },
          gallery: { ...(base.resources?.gallery || {}), name: "گالری" },
          product: { ...(base.resources?.product || {}), name: "محصولات" },
          product_status: {
            ...(base.resources?.product_status || {}),
            name: "وضعیت‌های محصول",
          },
        },
      };
      admin.options.locale = {
        language: "fa",
        availableLanguages: ["fa", "en"],
        translations: merged,
      };
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(
      "[AdminJS] Could not load external fa translation:",
      e?.message
    );
  }

  // Force locale to our bundled Persian translation and ensure language selector shows
  admin.options.locale = {
    language: "fa",
    availableLanguages: ["fa", "en"],
    translations: faTranslations,
  };

  // Add/override resource names in Persian
  admin.options.locale.translations.resources = {
    ...(admin.options.locale.translations.resources || {}),
    article: { name: "مقالات" },
    article_type: { name: "انواع مقاله" },
    brand: { name: "برندها" },
    category: { name: "دسته‌بندی‌ها" },
    gallery: { name: "گالری" },
    product: { name: "محصولات" },
    product_status: { name: "وضعیت‌های محصول" },
  };

  // Important: do NOT attach body parsers before AdminJS router.
  // AdminJS uses express-formidable internally and will throw OldBodyParserUsedError
  // if req._body is already set.

  // Relax CSP only for AdminJS routes so its inline scripts/styles can run
  app.use(
    admin.options.rootPath,
    helmet({
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
    })
  );

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
        console.warn(
          "[AdminJS] bypassing role check due to ADMINJS_IGNORE_ROLE_CHECK=true"
        );
        return { email: u.userName, id: u.id };
      }
      console.warn("[AdminJS] user not superadmin", {
        email,
        roles: roleNames,
      });
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
