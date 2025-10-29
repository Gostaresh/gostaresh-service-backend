"use strict";

const crypto = require("crypto");
const { user } = require("@/models");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

exports.list = async ({ limit = 50, offset = 0 } = {}) => {
  const { rows, count } = await user.findAndCountAll({
    attributes: { exclude: ["password"] },
    limit: Math.min(Number(limit) || 50, 200),
    offset: Number(offset) || 0,
    order: [["createdAt", "DESC"]],
  });
  return { items: rows, total: count };
};

exports.create = async ({ firstName, lastName, userName, email, password }) => {
  const passwordHash = hashPassword(password);
  const created = await user.create({
    firstName,
    lastName,
    userName,
    email,
    password: passwordHash,
  });
  const plain = created.get({ plain: true });
  delete plain.password;
  return plain;
};

exports.get = async (id) => {
  const found = await user.findByPk(id, { attributes: { exclude: ["password"] } });
  return found;
};

exports.update = async (id, payload) => {
  const data = { ...payload };
  if (data.password) {
    data.password = hashPassword(data.password);
  }
  await user.update(data, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return user.destroy({ where: { id } });
};
