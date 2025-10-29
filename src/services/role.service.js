"use strict";

const { role, permission, role_permission, user_role } = require("@/models");

exports.list = async () => {
  return role.findAll({ order: [["createdAt", "DESC"]] });
};

exports.get = async (id) => {
  return role.findByPk(id, { include: [{ model: permission, as: "permissions", through: { attributes: [] } }] });
};

exports.create = async (payload) => {
  const created = await role.create(payload);
  return exports.get(created.id);
};

exports.update = async (id, payload) => {
  await role.update(payload, { where: { id } });
  return exports.get(id);
};

exports.remove = async (id) => {
  return role.destroy({ where: { id } });
};

exports.setPermissions = async (id, permissionIDs = []) => {
  await role_permission.destroy({ where: { roleID: id } });
  if (permissionIDs.length > 0) {
    await role_permission.bulkCreate(permissionIDs.map((pid) => ({ roleID: id, permissionID: pid })));
  }
  return exports.get(id);
};

exports.setUserRoles = async (userID, roleIDs = []) => {
  await user_role.destroy({ where: { userID } });
  if (roleIDs.length > 0) {
    await user_role.bulkCreate(roleIDs.map((rid) => ({ userID, roleID: rid })));
  }
  return true;
};

exports.getUserRoles = async (userID) => {
  const rows = await user_role.findAll({ where: { userID }, raw: true });
  return rows.map((r) => r.roleID);
};
