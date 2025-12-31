"use strict";

const { Router } = require("express");
const controller = require("@/controllers/auth.controller");
const { authenticate } = require("@/middlewares/auth");
const { createRateLimiter } = require("@/middlewares/rate_limit");

const router = Router();

const loginLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.RATE_LIMIT_LOGIN_MAX || "10", 10),
  message: "Too many login attempts, please try again later.",
});

router.post("/login", loginLimiter, controller.login);
router.post("/logout", authenticate, controller.logout);
router.get("/me", authenticate, controller.me);

module.exports = router;
