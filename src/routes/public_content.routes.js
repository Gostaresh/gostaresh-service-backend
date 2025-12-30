"use strict";

const { Router } = require("express");
const controller = require("@/controllers/public_content.controller");

const router = Router();

// Public content endpoints (no auth)
router.get("/content", controller.list);
router.get("/content/:key", controller.get);

module.exports = router;
