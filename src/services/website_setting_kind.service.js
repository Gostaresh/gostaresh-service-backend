"use strict";

const { website_setting_kind, website_setting } = require("@/models");

exports.list = async () => {
  return website_setting_kind.findAll({ order: [["createdAt", "DESC"]] });
};

exports.get = async (id) => {
  return website_setting_kind.findByPk(id, { include: [{ model: website_setting, as: "settings" }] });
};

exports.create = async (payload) => {
  const created = await website_setting_kind.create(payload);
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  await website_setting_kind.update(payload, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return website_setting_kind.destroy({ where: { id } });
};

