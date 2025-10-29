"use strict";

const { Router } = require("express");
const controller = require("@/controllers/product_status.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("product_status.read"),
  controller.list
);

module.exports = router;

