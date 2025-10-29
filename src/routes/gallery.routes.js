"use strict";

const { Router } = require("express");
const controller = require("@/controllers/gallery.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

// Nested under products for clarity
router.get(
  "/products/:productId/galleries",
  authenticate,
  authorizePermissions("gallery.read"),
  controller.listByProduct
);
router.post(
  "/products/:productId/galleries",
  authenticate,
  authorizePermissions("gallery.create"),
  controller.addToProduct
);

router.patch(
  "/galleries/:id/main",
  authenticate,
  authorizePermissions("gallery.update"),
  controller.setMain
);
router.patch(
  "/galleries/:id",
  authenticate,
  authorizePermissions("gallery.update"),
  controller.update
);
router.delete(
  "/galleries/:id",
  authenticate,
  authorizePermissions("gallery.delete"),
  controller.remove
);

module.exports = router;

