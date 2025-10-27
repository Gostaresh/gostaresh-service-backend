"use strict";

const { Router } = require("express");
const userRoutes = require("@/routes/user.routes");
const authRoutes = require("@/routes/auth.routes");
const warrantyRoutes = require("@/routes/warranty.routes");
const uploadRoutes = require("@/routes/upload.routes");

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/warranty", warrantyRoutes);
router.use("/files", uploadRoutes);

module.exports = router;
