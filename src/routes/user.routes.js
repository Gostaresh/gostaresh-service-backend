'use strict';

const { Router } = require('express');
const controller = require('../controllers/user.controller');
const { authenticate, authorizePermissions } = require('../middlewares/auth');

const router = Router();

router.get('/', authenticate, authorizePermissions('user.read'), controller.list);
router.post('/', authenticate, authorizePermissions('user.create'), controller.create);

module.exports = router;
