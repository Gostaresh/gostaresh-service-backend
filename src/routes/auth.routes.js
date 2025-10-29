"use strict";

const { Router } = require("express");
const controller = require("@/controllers/auth.controller");
const { authenticate } = require("@/middlewares/auth");

const router = Router();

router.post("/login", controller.login);
router.post("/logout", authenticate, controller.logout);
router.get("/me", authenticate, controller.me);

module.exports = router;
