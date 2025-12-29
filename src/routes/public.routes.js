"use strict";

const { Router } = require("express");
const controller = require("@/controllers/public.controller");

const router = Router();

// Public, no auth
router.get("/product/:slug", controller.productBySlug);
router.get("/brand/:slug", controller.brandBySlug);
router.get("/category/:slug", controller.categoryBySlug);
router.get("/article/:slug", controller.articleBySlug);
router.get("/service-centers", controller.serviceCenterList);
router.get("/service-center/:slug", controller.serviceCenterBySlug);

module.exports = router;
