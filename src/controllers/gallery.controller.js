"use strict";

const Joi = require("joi");
const galleryService = require("@/services/gallery.service");

const idParamSchema = Joi.object({ id: Joi.string().uuid().required() });

exports.listByProduct = async (req, res, next) => {
  try {
    const schema = Joi.object({ productId: Joi.string().uuid().required() });
    const { error } = schema.validate({ productId: req.params.productId });
    if (error) return res.status(400).json({ message: error.message });
    const items = await galleryService.listByProduct(req.params.productId);
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.addToProduct = async (req, res, next) => {
  try {
    const payloadSchema = Joi.object({
      path: Joi.string().min(1).required(),
      fileName: Joi.string().min(1).required(),
      isMain: Joi.boolean().default(false),
      isActive: Joi.boolean().default(true),
    });
    const paramsSchema = Joi.object({ productId: Joi.string().uuid().required() });
    const { error: pErr } = paramsSchema.validate({ productId: req.params.productId });
    if (pErr) return res.status(400).json({ message: pErr.message });
    const { error, value } = payloadSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const created = await galleryService.addToProduct({ productID: req.params.productId, ...value });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.setMain = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const updated = await galleryService.setMain(req.params.id);
    if (!updated) return res.status(404).json({ message: "Not Found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const payloadSchema = Joi.object({ isActive: Joi.boolean(), isMain: Joi.boolean() });
    const { error: vErr, value } = payloadSchema.validate(req.body);
    if (vErr) return res.status(400).json({ message: vErr.message });
    const updated = await galleryService.update(req.params.id, value);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const n = await galleryService.remove(req.params.id);
    if (!n) return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

