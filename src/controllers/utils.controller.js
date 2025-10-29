"use strict";

const Joi = require("joi");
const { generateUniqueSlug } = require("@/utils/slug");
const models = require("@/models");

const modelMap = {
  product: () => models.product,
  category: () => models.category,
  brand: () => models.brand,
  article: () => models.article,
};

exports.previewSlug = async (req, res, next) => {
  try {
    const schema = Joi.object({
      model: Joi.string().valid("product", "category", "brand", "article").required(),
      source: Joi.string().min(1).required(),
      excludeId: Joi.string().uuid().optional(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const Model = modelMap[value.model]();
    const slug = await generateUniqueSlug(Model, value.source, { idToExclude: value.excludeId });
    res.json({ slug });
  } catch (err) { next(err); }
};

