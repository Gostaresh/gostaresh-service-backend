'use strict';

const { Router } = require('express');
const controller = require('../controllers/warranty.controller');

const router = Router();

// Public endpoint for warranty inquiry by serial
router.get('/inquiry/:serial', controller.inquiry);

module.exports = router;

