"use strict";

const { Router } = require("express");
const controller = require("@/controllers/service_center.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("service_center.read"),
  controller.list
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("service_center.read"),
  controller.get
);
router.post(
  "/",
  authenticate,
  authorizePermissions("service_center.create"),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("service_center.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("service_center.delete"),
  controller.remove
);

module.exports = router;
