"use strict";

const { gallery } = require("@/models");
const { Op } = require("sequelize");

exports.listByProduct = async (productID) => {
  return gallery.findAll({ where: { productID }, order: [["createdAt", "DESC"]] });
};

exports.addToProduct = async ({ productID, path, fileName, isMain = false, isActive = true }) => {
  const created = await gallery.create({ productID, path, fileName, isMain, isActive });
  if (isMain) {
    await gallery
      .update({ isMain: false }, { where: { productID, id: { [Op.ne]: created.id } } })
      .catch(() => {});
  }
  return created;
};

exports.setMain = async (id) => {
  const item = await gallery.findByPk(id);
  if (!item) return null;
  await gallery.update({ isMain: false }, { where: { productID: item.productID } });
  await item.update({ isMain: true });
  return item;
};

exports.update = async (id, data) => {
  await gallery.update(data, { where: { id } });
  return gallery.findByPk(id);
};

exports.remove = async (id) => {
  return gallery.destroy({ where: { id } });
};
