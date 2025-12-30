"use strict";

const { Op } = require("sequelize");
const { product, brand, category, product_status, gallery, user } = require("@/models");
const { generateUniqueSlug, normalizeBase } = require("@/utils/slug");

exports.list = async ({ q, brandID, categoryID, statusID, isActive, limit = 20, offset = 0 }) => {
  const where = {};
  if (q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { title: { [Op.like]: `%${q}%` } },
    ];
  }
  if (brandID) where.brandID = brandID;
  if (categoryID) where.categoryID = categoryID;
  if (statusID) where.statusID = statusID;
  if (typeof isActive !== "undefined") where.isActive = isActive;

  const { rows, count } = await product.findAndCountAll({
    where,
    limit: Math.min(Number(limit) || 20, 100),
    offset: Number(offset) || 0,
    order: [["createdAt", "DESC"]],
    include: [
      { model: brand, as: "brand" },
      { model: category, as: "category" },
      { model: product_status, as: "status" },
      { model: gallery, as: "galleries" },
      { model: user, as: "creator", attributes: { exclude: ["password"] } },
    ],
  });
  return { items: rows, total: count };
};

exports.get = async (id) => {
  return product.findByPk(id, {
    include: [
      { model: brand, as: "brand" },
      { model: category, as: "category" },
      { model: product_status, as: "status" },
      { model: gallery, as: "galleries" },
      { model: user, as: "creator", attributes: { exclude: ["password"] } },
    ],
  });
};

exports.getBySlug = async (slug) => {
  return product.findOne({
    where: { slug },
    include: [
      { model: brand, as: "brand" },
      { model: category, as: "category" },
      { model: product_status, as: "status" },
      { model: gallery, as: "galleries" },
      { model: user, as: "creator", attributes: { exclude: ["password"] } },
    ],
  });
};

exports.create = async (payload, createdBy) => {
  const data = { ...payload };
  if (data.name || data.title || data.slug) {
    const base = data.slug || data.name || data.title;
    data.slug = await generateUniqueSlug(product, base);
  }
  if (createdBy) data.createdBy = createdBy;
  const created = await product.create(data);
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  const data = { ...payload };
  if (data.name || data.title || data.slug) {
    const base = data.slug || data.name || data.title;
    data.slug = await generateUniqueSlug(product, base, { idToExclude: id });
  }
  await product.update(data, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return product.destroy({ where: { id } });
};
