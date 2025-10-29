"use strict";

const { Router } = require("express");
const controller = require("@/controllers/brand.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("brand.read"),
  controller.list
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("brand.read"),
  controller.get
);
router.post(
  "/",
  authenticate,
  authorizePermissions("brand.create"),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("brand.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("brand.delete"),
  controller.remove
);

module.exports = router;

