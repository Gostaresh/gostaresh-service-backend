"use strict";

const { Op } = require("sequelize");
const { website_setting, website_setting_kind } = require("@/models");

exports.list = async ({ q, kindID, isActive, limit = 50, offset = 0 } = {}) => {
  const where = {};
  if (q) where.name = { [Op.like]: `%${q}%` };
  if (kindID) where.kindID = kindID;
  if (typeof isActive !== "undefined") where.isActive = isActive;
  const { rows, count } = await website_setting.findAndCountAll({
    where,
    include: [{ model: website_setting_kind, as: "kind" }],
    limit: Math.min(Number(limit) || 50, 200),
    offset: Number(offset) || 0,
    order: [["createdAt", "DESC"]],
  });
  return { items: rows, total: count };
};

exports.get = async (id) => {
  return website_setting.findByPk(id, { include: [{ model: website_setting_kind, as: "kind" }] });
};

exports.create = async (payload) => {
  const created = await website_setting.create(payload);
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  await website_setting.update(payload, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return website_setting.destroy({ where: { id } });
};

