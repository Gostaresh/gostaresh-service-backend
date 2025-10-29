"use strict";

const Joi = require("joi");
const productService = require("@/services/product.service");
const brandService = require("@/services/brand.service");
const categoryService = require("@/services/category.service");
const articleService = require("@/services/article.service");

const slugSchema = Joi.object({ slug: Joi.string().min(1).max(200).required() });

exports.productBySlug = async (req, res, next) => {
  try {
    const { error } = slugSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const item = await productService.getBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.brandBySlug = async (req, res, next) => {
  try {
    const { error } = slugSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const item = await brandService.getBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.categoryBySlug = async (req, res, next) => {
  try {
    const { error } = slugSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const item = await categoryService.getBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.articleBySlug = async (req, res, next) => {
  try {
    const { error } = slugSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.message });
    const item = await articleService.getBySlug(req.params.slug);
    if (!item) return res.status(404).json({ message: "Not Found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

