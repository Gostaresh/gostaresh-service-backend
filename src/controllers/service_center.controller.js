"use strict";

const Joi = require("joi");
const service = require("@/services/service_center.service");

const idParam = Joi.object({
  id: Joi.string().min(1).max(64).required(),
});

const contactItemSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  value: Joi.string().allow("", null),
});

const createSchema = Joi.object({
  slug: Joi.string().min(1).max(200).optional(),
  title: Joi.string().min(1).max(200).required(),
  city: Joi.string().allow("", null),
  tagline: Joi.string().allow("", null),
  summary: Joi.string().allow("", null),
  image: Joi.string().allow("", null),
  primary: Joi.boolean().default(false),
  contacts: Joi.array().items(contactItemSchema),
  services: Joi.array().items(Joi.string().min(1)),
  isActive: Joi.boolean().default(true),
});

const updateSchema = createSchema.fork(["title"], (s) => s.optional());

exports.list = async (req, res, next) => {
  try {
    const { q, city, primary, isActive, limit, offset } = req.query;
    const result = await service.list({
      q,
      city,
      primary:
        typeof primary === "undefined"
          ? undefined
          : primary === "true" || primary === true,
      isActive:
        typeof isActive === "undefined"
          ? undefined
          : isActive === "true" || isActive === true,
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
    const created = await service.create(value);
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
    const updated = await service.update(req.params.id, value);
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
