'use strict';

const Joi = require('joi');
const warrantyService = require('../services/warranty.service');

const paramsSchema = Joi.object({
  serial: Joi.string().min(3).max(100).required(),
});

exports.inquiry = async (req, res, next) => {
  try {
    const { error, value } = paramsSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const result = await warrantyService.inquiry(value.serial);
    res.json(result);
  } catch (err) {
    // Pass upstream status when relevant
    if (err && typeof err.status === 'number') {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
};

