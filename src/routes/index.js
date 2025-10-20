'use strict';

const { Router } = require('express');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
