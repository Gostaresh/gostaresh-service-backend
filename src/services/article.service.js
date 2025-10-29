"use strict";

const { Op } = require("sequelize");
const { article, article_type, user } = require("@/models");
const { generateUniqueSlug } = require("@/utils/slug");

// articleTypeID is the sole source of truth; no enum mapping here.

exports.list = async ({ q, articleTypeID, isActive, limit = 20, offset = 0 }) => {
  const where = {};
  if (q) where.title = { [Op.like]: `%${q}%` };
  if (typeof isActive !== "undefined") where.isActive = isActive;
  if (articleTypeID) where.articleTypeID = articleTypeID;
  const include = [
    { model: article_type, as: "article_types" },
    { model: user, as: "author", attributes: { exclude: ["password"] } },
  ];
  const { rows, count } = await article.findAndCountAll({
    where,
    include,
    limit: Math.min(Number(limit) || 20, 100),
    offset: Number(offset) || 0,
    order: [["createdAt", "DESC"]],
  });
  return { items: rows, total: count };
};

exports.get = async (id) => {
  return article.findByPk(id, {
    include: [
      { model: article_type, as: "article_types" },
      { model: user, as: "author", attributes: { exclude: ["password"] } },
    ],
  });
};

exports.getBySlug = async (slug) => {
  return article.findOne({
    where: { slug },
    include: [
      { model: article_type, as: "article_types" },
      { model: user, as: "author", attributes: { exclude: ["password"] } },
    ],
  });
};

exports.create = async (payload, userID) => {
  const data = { ...payload };
  if (data.title || data.slug) {
    const base = data.slug || data.title;
    data.slug = await generateUniqueSlug(article, base);
  }
  data.userID = userID || data.userID || null;
  // Expect articleTypeID directly; no enum support
  const created = await article.create(data);
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  const data = { ...payload };
  if (data.title || data.slug) {
    const base = data.slug || data.title;
    data.slug = await generateUniqueSlug(article, base, { idToExclude: id });
  }
  // Only articleTypeID accepted
  await article.update(data, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return article.destroy({ where: { id } });
};

exports.listTypes = async () => {
  return article_type.findAll({ order: [["createdAt", "DESC"]] });
};

exports.createType = async (name) => {
  const existing = await article_type.findOne({ where: { name } });
  if (existing) return existing;
  return article_type.create({ name, isActive: true });
};

exports.updateType = async (id, name) => {
  await article_type.update({ name }, { where: { id } });
  return article_type.findByPk(id);
};

exports.deleteType = async (id) => {
  return article_type.destroy({ where: { id } });
};
