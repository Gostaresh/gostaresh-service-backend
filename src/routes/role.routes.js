"use strict";

const { Router } = require("express");
const controller = require("@/controllers/role.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get("/", authenticate, authorizePermissions("role.read"), controller.list);
router.get("/:id", authenticate, authorizePermissions("role.read"), controller.get);
router.post("/", authenticate, authorizePermissions("role.create"), controller.create);
router.put("/:id", authenticate, authorizePermissions("role.update"), controller.update);
router.delete("/:id", authenticate, authorizePermissions("role.delete"), controller.remove);
router.put(
  "/:id/permissions",
  authenticate,
  authorizePermissions("role_permission.update"),
  controller.setPermissions
);

module.exports = router;

