"use strict";

const { Router } = require("express");
const controller = require("@/controllers/product.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("product.read"),
  controller.list
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("product.read"),
  controller.get
);
router.post(
  "/",
  authenticate,
  authorizePermissions("product.create"),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("product.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("product.delete"),
  controller.remove
);

module.exports = router;

