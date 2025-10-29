"use strict";

const { Router } = require("express");
const controller = require("@/controllers/category.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("category.read"),
  controller.list
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("category.read"),
  controller.get
);
router.post(
  "/",
  authenticate,
  authorizePermissions("category.create"),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("category.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("category.delete"),
  controller.remove
);

module.exports = router;

