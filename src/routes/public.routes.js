"use strict";

const { Router } = require("express");
const publicController = require("@/controllers/public.controller");
const publicContentController = require("@/controllers/public_content.controller");

const router = Router();

// Public, no auth
router.get("/content", publicContentController.list);
router.get("/content/:key", publicContentController.get);
router.get("/products/:slug", publicController.productBySlug);
router.get("/brands/:slug", publicController.brandBySlug);
router.get("/categories/:slug", publicController.categoryBySlug);
router.get("/articles/:slug", publicController.articleBySlug);
router.get("/service-centers", publicController.serviceCenterList);
router.get("/service-centers/:slug", publicController.serviceCenterBySlug);

module.exports = router;
