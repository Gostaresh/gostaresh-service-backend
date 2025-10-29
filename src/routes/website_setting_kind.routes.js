"use strict";

const { Router } = require("express");
const controller = require("@/controllers/website_setting_kind.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("website_setting_kind.read"),
  controller.list
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("website_setting_kind.read"),
  controller.get
);
router.post(
  "/",
  authenticate,
  authorizePermissions("website_setting_kind.create"),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("website_setting_kind.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("website_setting_kind.delete"),
  controller.remove
);

module.exports = router;

