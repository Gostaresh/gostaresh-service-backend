"use strict";

const Joi = require("joi");
const brandService = require("@/services/brand.service");

const idParamSchema = Joi.object({ id: Joi.string().uuid().required() });

const createSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
  logo: Joi.string().allow("", null),
  summary: Joi.string().allow("", null),
  tags: Joi.array().items(Joi.string().allow("", null)).allow(null),
  slug: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
});

const updateSchema = createSchema.fork(["name"], (s) => s.optional());

exports.list = async (req, res, next) => {
  try {
    const { q, isActive, limit, offset } = req.query;
    const items = await brandService.list({ q, isActive: typeof isActive === "undefined" ? undefined : isActive === "true" || isActive === true, limit, offset });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const item = await brandService.get(req.params.id);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const created = await brandService.create(value);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error: pErr } = idParamSchema.validate(req.params);
    if (pErr) return res.status(400).json({ message: pErr.message });
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const updated = await brandService.update(req.params.id, value);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const n = await brandService.remove(req.params.id);
    if (!n) return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
