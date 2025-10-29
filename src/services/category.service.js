"use strict";

const { category, product } = require("@/models");
const { Op } = require("sequelize");
const { generateUniqueSlug } = require("@/utils/slug");

exports.list = async ({ q, parentID, isActive, limit = 100, offset = 0 } = {}) => {
  const where = {};
  if (q) where.name = { [Op.like]: `%${q}%` };
  if (parentID) where.parentID = parentID;
  if (typeof isActive !== "undefined") where.isActive = isActive;
  const { rows, count } = await category.findAndCountAll({
    where,
    include: [
      { model: category, as: "parent" },
      { model: category, as: "children" },
      { model: product, as: "products" },
    ],
    limit: Math.min(Number(limit) || 100, 300),
    offset: Number(offset) || 0,
    order: [["createdAt", "DESC"]],
  });
  return { items: rows, total: count };
};

exports.get = async (id) => {
  return category.findByPk(id, {
    include: [
      { model: category, as: "parent" },
      { model: category, as: "children" },
      { model: product, as: "products" },
    ],
  });
};

exports.getBySlug = async (slug) => {
  return category.findOne({
    where: { slug },
    include: [
      { model: category, as: "parent" },
      { model: category, as: "children" },
      { model: product, as: "products" },
    ],
  });
};

exports.create = async (payload) => {
  const data = { ...payload };
  if (data.name || data.slug) {
    const base = data.slug || data.name;
    data.slug = await generateUniqueSlug(category, base);
  }
  const created = await category.create(data);
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  const data = { ...payload };
  if (data.name || data.slug) {
    const base = data.slug || data.name;
    data.slug = await generateUniqueSlug(category, base, { idToExclude: id });
  }
  await category.update(data, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return category.destroy({ where: { id } });
};
