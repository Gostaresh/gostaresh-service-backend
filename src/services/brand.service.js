"use strict";

const { brand, product } = require("@/models");
const { Op } = require("sequelize");
const { generateUniqueSlug } = require("@/utils/slug");

exports.list = async ({ q, isActive, limit = 50, offset = 0 } = {}) => {
  const where = {};
  if (q) where.name = { [Op.like]: `%${q}%` };
  if (typeof isActive !== "undefined") where.isActive = isActive;
  const { rows, count } = await brand.findAndCountAll({
    where,
    include: [{ model: product, as: "products" }],
    limit: Math.min(Number(limit) || 50, 200),
    offset: Number(offset) || 0,
    order: [["createdAt", "DESC"]],
  });
  return { items: rows, total: count };
};

exports.get = async (id) => {
  return brand.findByPk(id, { include: [{ model: product, as: "products" }] });
};

exports.getBySlug = async (slug) => {
  return brand.findOne({ where: { slug }, include: [{ model: product, as: "products" }] });
};

exports.create = async (payload) => {
  const data = { ...payload };
  if (data.name || data.slug) {
    const base = data.slug || data.name;
    data.slug = await generateUniqueSlug(brand, base);
  }
  const created = await brand.create(data);
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  const data = { ...payload };
  if (data.name || data.slug) {
    const base = data.slug || data.name;
    data.slug = await generateUniqueSlug(brand, base, { idToExclude: id });
  }
  await brand.update(data, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return brand.destroy({ where: { id } });
};
