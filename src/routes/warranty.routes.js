"use strict";

const { Router } = require("express");
const controller = require("@/controllers/warranty.controller");
const { createRateLimiter } = require("@/middlewares/rate_limit");

const router = Router();

const inquiryLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WARRANTY_WINDOW_MS || "60000", 10),
  max: parseInt(process.env.RATE_LIMIT_WARRANTY_MAX || "30", 10),
  message: "Too many inquiries, please try again later.",
});

// Public endpoint for warranty inquiry by serial
router.get("/inquiry/:serial", inquiryLimiter, controller.inquiry);

module.exports = router;
