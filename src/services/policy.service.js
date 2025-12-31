"use strict";

const { Op } = require("sequelize");
const { randomUUID } = require("crypto");
const { policy } = require("@/models");

async function nextSortOrder() {
  const maxOrder = await policy.max("sortOrder");
  if (typeof maxOrder === "number" && Number.isFinite(maxOrder)) {
    return maxOrder + 1;
  }
  return 1;
}

exports.list = async ({ q, brand, category, product, limit = 50, offset = 0 } = {}) => {
  const where = {};
  if (brand) where.brand = brand;
  if (category) where.category = category;
  if (product) where.product = product;
  if (q) {
    where[Op.or] = [
      { brand: { [Op.like]: `%${q}%` } },
      { category: { [Op.like]: `%${q}%` } },
      { product: { [Op.like]: `%${q}%` } },
      { conditions: { [Op.like]: `%${q}%` } },
    ];
  }

  const { rows, count } = await policy.findAndCountAll({
    where,
    limit: Math.min(Number(limit) || 50, 200),
    offset: Number(offset) || 0,
    order: [
      ["sortOrder", "ASC"],
      ["createdAt", "ASC"],
    ],
  });

  return { items: rows, total: count };
};

exports.get = async (id) => {
  return policy.findByPk(id);
};

exports.create = async (payload) => {
  const data = { ...payload };
  if (!data.id) data.id = randomUUID();
  if (typeof data.sortOrder === "undefined" || data.sortOrder === null) {
    data.sortOrder = await nextSortOrder();
  }
  const created = await policy.create(data);
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  const data = { ...payload };
  await policy.update(data, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return policy.destroy({ where: { id } });
};
