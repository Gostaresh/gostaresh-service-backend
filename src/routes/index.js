"use strict";

const { Router } = require("express");
const userRoutes = require("@/routes/user.routes");
const authRoutes = require("@/routes/auth.routes");
const warrantyRoutes = require("@/routes/warranty.routes");
const uploadRoutes = require("@/routes/upload.routes");
const productRoutes = require("@/routes/product.routes");
const categoryRoutes = require("@/routes/category.routes");
const brandRoutes = require("@/routes/brand.routes");
const galleryRoutes = require("@/routes/gallery.routes");
const articleRoutes = require("@/routes/article.routes");
const websiteSettingRoutes = require("@/routes/website_setting.routes");
const websiteSettingKindRoutes = require("@/routes/website_setting_kind.routes");
const utilsRoutes = require("@/routes/utils.routes");
const permissionRoutes = require("@/routes/permission.routes");
const roleRoutes = require("@/routes/role.routes");
const productStatusRoutes = require("@/routes/product_status.routes");
const serviceCenterRoutes = require("@/routes/service_center.routes");

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/warranty", warrantyRoutes);
router.use("/files", uploadRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/brands", brandRoutes);
router.use("/", galleryRoutes);
router.use("/articles", articleRoutes);
router.use("/website-settings", websiteSettingRoutes);
router.use("/website-setting-kinds", websiteSettingKindRoutes);
router.use("/utils", utilsRoutes);
router.use("/permissions", permissionRoutes);
router.use("/roles", roleRoutes);
router.use("/product-statuses", productStatusRoutes);
router.use("/service-centers", serviceCenterRoutes);

module.exports = router;
