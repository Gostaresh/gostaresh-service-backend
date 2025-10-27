"use strict";

const crypto = require("crypto");
const { user } = require("@/models");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

exports.list = async () => {
  return user.findAll({ attributes: { exclude: ["password"] } });
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
