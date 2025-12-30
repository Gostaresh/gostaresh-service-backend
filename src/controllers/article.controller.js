"use strict";

const Joi = require("joi");
const articleService = require("@/services/article.service");

const idParamSchema = Joi.object({ id: Joi.string().uuid().required() });

const createSchema = Joi.object({
  title: Joi.string().min(1).max(300).required(),
  excerpt: Joi.string().allow("", null),
  cover: Joi.string().allow("", null),
  date: Joi.string().allow("", null),
  readMinutes: Joi.number().integer().min(0).allow(null),
  tags: Joi.array().items(Joi.string().allow("", null)).allow(null),
  hot: Joi.boolean(),
  content: Joi.string().allow("", null),
  shortContent: Joi.string().allow("", null),
  longContent: Joi.string().allow("", null),
  articleTypeID: Joi.string().uuid().optional(),
  slug: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
});

const updateSchema = createSchema.fork(["title"], (s) => s.optional());

exports.list = async (req, res, next) => {
  try {
    const { q, articleTypeID, isActive, limit, offset } = req.query;
    const result = await articleService.list({
      q,
      articleTypeID,
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
    const item = await articleService.get(req.params.id);
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
    const created = await articleService.create(value, req.auth?.sub);
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
    const updated = await articleService.update(req.params.id, value);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { error } = idParamSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const n = await articleService.remove(req.params.id);
    if (!n) return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

exports.listTypes = async (req, res, next) => {
  try {
    const items = await articleService.listTypes();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.createType = async (req, res, next) => {
  try {
    const schema = Joi.object({ name: Joi.string().valid("blog", "news", "education").required() });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const created = await articleService.createType(value.name);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.updateType = async (req, res, next) => {
  try {
    const idSchema = Joi.object({ id: Joi.string().uuid().required() });
    const { error: pErr } = idSchema.validate(req.params);
    if (pErr) return res.status(400).json({ message: pErr.message });
    const schema = Joi.object({ name: Joi.string().min(1).max(100).required() });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const updated = await articleService.updateType(req.params.id, value.name);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.deleteType = async (req, res, next) => {
  try {
    const idSchema = Joi.object({ id: Joi.string().uuid().required() });
    const { error } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const n = await articleService.deleteType(req.params.id);
    if (!n) return res.status(404).json({ message: "Not Found" });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};
