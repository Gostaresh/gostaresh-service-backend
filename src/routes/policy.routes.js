"use strict";

const { Router } = require("express");
const controller = require("@/controllers/policy.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("policy.read"),
  controller.list
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("policy.read"),
  controller.get
);
router.post(
  "/",
  authenticate,
  authorizePermissions("policy.create"),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("policy.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("policy.delete"),
  controller.remove
);

module.exports = router;
