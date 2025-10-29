"use strict";

const { Router } = require("express");
const controller = require("@/controllers/permission.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("permission.read"),
  controller.list
);

module.exports = router;

