"use strict";

const Joi = require("joi");
const productService = require("@/services/product.service");

const idParamSchema = Joi.object({ id: Joi.string().uuid().required() });

const createSchema = Joi.object({
  name: Joi.string().min(1).max(300).required(),
  shortDescription: Joi.string().allow("", null),
  longDescription: Joi.string().allow("", null),
  price: Joi.number().integer().min(0).required(),
  statusID: Joi.string().uuid().optional(),
  brandID: Joi.string().uuid().optional(),
  categoryID: Joi.string().uuid().optional(),
  slug: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
});

const updateSchema = createSchema.fork(["name", "price"], (s) => s.optional());

exports.list = async (req, res, next) => {
  try {
    const { q, brandID, categoryID, statusID, isActive, limit, offset } = req.query;
    const result = await productService.list({
      q,
      brandID,
      categoryID,
      statusID,
      isActive: typeof isActive === "undefined" ? undefined : isActive === "true" || isActive === true,
      limit,
      offset,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const item = await productService.get(req.params.id);
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
    const created = await productService.create(value, req.auth?.sub);
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
    const updated = await productService.update(req.params.id, value);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const n = await productService.remove(req.params.id);
    if (!n) return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

