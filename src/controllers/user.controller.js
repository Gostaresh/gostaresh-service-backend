'use strict';

const Joi = require('joi');
const userService = require('../services/user.service');
const roleService = require('../services/role.service');

const createSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  userName: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(200).required(),
});

exports.list = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const users = await userService.list({ limit, offset });
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

const idParamSchema = Joi.object({ id: Joi.string().uuid().required() });
const updateSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  userName: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(200).optional(),
});

exports.get = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const item = await userService.get(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not Found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { error: pErr } = idParamSchema.validate(req.params);
    if (pErr) return res.status(400).json({ message: pErr.message });
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const updated = await userService.update(req.params.id, value);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const n = await userService.remove(req.params.id);
    if (!n) return res.status(404).json({ message: 'Not Found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.getRoles = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const roleIDs = await roleService.getUserRoles(req.params.id);
    res.json({ roleIDs });
  } catch (err) { next(err); }
};

exports.setRoles = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const schema = Joi.object({ roleIDs: Joi.array().items(Joi.string().uuid()).required() });
    const { error: vErr, value } = schema.validate(req.body);
    if (vErr) return res.status(400).json({ message: vErr.message });
    await roleService.setUserRoles(req.params.id, value.roleIDs);
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
};
