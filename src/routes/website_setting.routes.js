"use strict";

const { Router } = require("express");
const controller = require("@/controllers/website_setting.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("website_setting.read"),
  controller.list
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("website_setting.read"),
  controller.get
);
router.post(
  "/",
  authenticate,
  authorizePermissions("website_setting.create"),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("website_setting.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("website_setting.delete"),
  controller.remove
);

module.exports = router;

