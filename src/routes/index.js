'use strict';

const { Router } = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const warrantyRoutes = require('./warranty.routes');

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/warranty', warrantyRoutes);

module.exports = router;
