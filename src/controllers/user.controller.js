'use strict';

const Joi = require('joi');
const userService = require('../services/user.service');

const createSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  userName: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(200).required(),
});

exports.list = async (req, res, next) => {
  try {
    const users = await userService.list();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const created = await userService.create(value);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};
