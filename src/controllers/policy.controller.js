"use strict";

const Joi = require("joi");
const service = require("@/services/policy.service");

const idParam = Joi.object({
  id: Joi.string().min(1).max(64).required(),
});

const durationSchema = Joi.object({
  value: Joi.number().integer().min(0).allow(null),
  unit: Joi.string().max(50).allow("", null),
});

const createSchema = Joi.object({
  id: Joi.string().max(64).optional(),
  brand: Joi.string().min(1).max(200).required(),
  category: Joi.string().min(1).max(200).required(),
  product: Joi.string().allow("", null),
  durationValue: Joi.number().integer().min(0).allow(null),
  durationUnit: Joi.string().max(50).allow("", null),
  duration: durationSchema.optional(),
  conditions: Joi.string().allow("", null),
  sortOrder: Joi.number().integer().min(1).allow(null),
});

const updateSchema = createSchema.fork(["brand", "category"], (schema) =>
  schema.optional()
);

function normalizePayload(input) {
  const data = { ...input };
  if (
    data.duration &&
    typeof data.durationValue === "undefined" &&
    typeof data.durationUnit === "undefined"
  ) {
    data.durationValue =
      typeof data.duration.value === "number" ? data.duration.value : null;
    data.durationUnit = data.duration.unit || null;
  }
  delete data.duration;

  if (typeof data.brand === "string") data.brand = data.brand.trim();
  if (typeof data.category === "string") data.category = data.category.trim();
  if (typeof data.product === "string") {
    data.product = data.product.trim();
    if (!data.product) data.product = null;
  }
  if (typeof data.durationUnit === "string") {
    data.durationUnit = data.durationUnit.trim() || null;
  }
  if (typeof data.conditions === "string") {
    data.conditions = data.conditions.trim() || null;
  }

  return data;
}

exports.list = async (req, res, next) => {
  try {
    const { q, brand, category, product, limit, offset } = req.query;
    const result = await service.list({
      q,
      brand,
      category,
      product,
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
    const { error } = idParam.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const item = await service.get(req.params.id);
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
    const created = await service.create(normalizePayload(value));
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error: pErr } = idParam.validate(req.params);
    if (pErr) return res.status(400).json({ message: pErr.message });
    const { error, value } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const updated = await service.update(
      req.params.id,
      normalizePayload(value)
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { error } = idParam.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const n = await service.remove(req.params.id);
    if (!n) return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
