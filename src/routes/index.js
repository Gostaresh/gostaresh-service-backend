"use strict";

const { Router } = require("express");
const userRoutes = require("@/routes/user.routes");
const authRoutes = require("@/routes/auth.routes");
const warrantyRoutes = require("@/routes/warranty.routes");

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/warranty", warrantyRoutes);

module.exports = router;
