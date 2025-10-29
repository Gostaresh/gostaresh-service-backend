"use strict";

const { Router } = require("express");
const controller = require("@/controllers/utils.controller");
const { authenticate } = require("@/middlewares/auth");

const router = Router();

router.post("/slug/preview", authenticate, controller.previewSlug);

module.exports = router;

