"use strict";

const { Router } = require("express");
const controller = require("@/controllers/user.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("user.read"),
  controller.list
);
router.post(
  "/",
  authenticate,
  authorizePermissions("user.create"),
  controller.create
);

router.get(
  "/:id",
  authenticate,
  authorizePermissions("user.read"),
  controller.get
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("user.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("user.delete"),
  controller.remove
);

// User roles
router.get(
  "/:id/roles",
  authenticate,
  authorizePermissions("user.read"),
  controller.getRoles
);
router.put(
  "/:id/roles",
  authenticate,
  authorizePermissions("user_role.update"),
  controller.setRoles
);

module.exports = router;
