"use strict";

const { Router } = require("express");
const controller = require("@/controllers/article.controller");
const { authenticate, authorizePermissions } = require("@/middlewares/auth");

const router = Router();

router.get(
  "/",
  authenticate,
  authorizePermissions("article.read"),
  controller.list
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("article.read"),
  controller.get
);
router.post(
  "/",
  authenticate,
  authorizePermissions("article.create"),
  controller.create
);
router.put(
  "/:id",
  authenticate,
  authorizePermissions("article.update"),
  controller.update
);
router.delete(
  "/:id",
  authenticate,
  authorizePermissions("article.delete"),
  controller.remove
);

router.get(
  "/types",
  authenticate,
  authorizePermissions("article_type.read"),
  controller.listTypes
);
router.post(
  "/types",
  authenticate,
  authorizePermissions("article_type.create"),
  controller.createType
);
router.put(
  "/types/:id",
  authenticate,
  authorizePermissions("article_type.update"),
  controller.updateType
);
router.delete(
  "/types/:id",
  authenticate,
  authorizePermissions("article_type.delete"),
  controller.deleteType
);

module.exports = router;
