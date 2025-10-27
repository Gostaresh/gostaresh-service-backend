"use strict";

const crypto = require("crypto");
const { user, role, permission } = require("../models");
const { signToken } = require("@/middlewares/auth");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

exports.login = async (userName, password) => {
  const passwordHash = hashPassword(password);
  const found = await user.findOne({
    where: { userName, password: passwordHash },
  });
  if (!found) return null;

  // load roles and permissions to embed a snapshot in token
  const withRelations = await user.findByPk(found.id, {
    include: [
      {
        model: role,
        as: "roles",
        through: { attributes: [] },
        include: [
          { model: permission, as: "permissions", through: { attributes: [] } },
        ],
      },
    ],
  });

  const roles = (withRelations.roles || []).map((r) => r.name);
  const perms = [];
  for (const r of withRelations.roles || []) {
    for (const p of r.permissions || []) perms.push(p.name);
  }

  const token = signToken({ sub: found.id, roles, perms });
  const safe = withRelations.get({ plain: true });
  delete safe.password;
  return { token, user: safe };
};
