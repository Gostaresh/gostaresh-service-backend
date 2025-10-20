"use strict";

const crypto = require("crypto");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();

      // Ensure superadmin role exists and has a proper UUID id
      const [roles] = await queryInterface.sequelize.query(
        'SELECT id FROM roles WHERE name = :name LIMIT 1',
        { replacements: { name: 'superadmin' }, transaction: t }
      );
      let roleId = roles && roles[0] && roles[0].id;
      if (roles && roles[0]) {
        if (!roleId || String(roleId).length === 0) {
          roleId = crypto.randomUUID();
          await queryInterface.sequelize.query(
            'UPDATE roles SET id = :id WHERE name = :name',
            { replacements: { id: roleId, name: 'superadmin' }, transaction: t }
          );
        }
      } else {
        roleId = crypto.randomUUID();
        await queryInterface.bulkInsert(
          'roles',
          [{ id: roleId, name: 'superadmin', createdAt: now, updatedAt: now }],
          { transaction: t }
        );
      }

      // Ensure admin user exists and has a proper UUID id
      const [users] = await queryInterface.sequelize.query(
        'SELECT id FROM users WHERE userName = :userName LIMIT 1',
        { replacements: { userName: 'admin' }, transaction: t }
      );
      let userId = users && users[0] && users[0].id;
      if (users && users[0]) {
        if (!userId || String(userId).length === 0) {
          userId = crypto.randomUUID();
          await queryInterface.sequelize.query(
            'UPDATE users SET id = :id WHERE userName = :userName',
            { replacements: { id: userId, userName: 'admin' }, transaction: t }
          );
        }
      } else {
        userId = crypto.randomUUID();
        await queryInterface.bulkInsert(
          'users',
          [{
            id: userId,
            firstName: 'Super',
            lastName: 'Admin',
            userName: 'admin',
            password: hashPassword('admin'),
            isActive: true,
            createdAt: now,
            updatedAt: now,
          }],
          { transaction: t }
        );
      }

      // Attach role to user if not already
      const [existingUserRole] = await queryInterface.sequelize.query(
        'SELECT 1 FROM user_roles WHERE userID = :userId AND roleID = :roleId LIMIT 1',
        { replacements: { userId, roleId }, transaction: t }
      );
      if (!existingUserRole || existingUserRole.length === 0) {
        await queryInterface.bulkInsert(
          'user_roles',
          [{ userID: userId, roleID: roleId, createdAt: now, updatedAt: now }],
          { transaction: t }
        );
      }

      // Grant all existing permissions to superadmin role
      const [perms] = await queryInterface.sequelize.query(
        'SELECT id FROM permissions',
        { transaction: t }
      );
      if (Array.isArray(perms) && perms.length > 0) {
        // Filter out already-attached ones
        const [attached] = await queryInterface.sequelize.query(
          'SELECT permissionID AS id FROM role_permissions WHERE roleID = :roleId',
          { replacements: { roleId }, transaction: t }
        );
        const attachedSet = new Set((attached || []).map((x) => x.id));
        const toAttach = perms.filter((p) => !attachedSet.has(p.id));
        if (toAttach.length > 0) {
          await queryInterface.bulkInsert(
            'role_permissions',
            toAttach.map((p) => ({ roleID: roleId, permissionID: p.id, createdAt: now, updatedAt: now })),
            { transaction: t }
          );
        }
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      // Remove bindings first
      const [rows] = await queryInterface.sequelize.query(
        'SELECT id FROM roles WHERE name = :name LIMIT 1',
        { replacements: { name: 'superadmin' }, transaction: t }
      );

      if (rows && rows[0]) {
        const roleId = rows[0].id;
        await queryInterface.bulkDelete('role_permissions', { roleID: roleId }, { transaction: t });
        await queryInterface.bulkDelete('user_roles', { roleID: roleId }, { transaction: t });
        await queryInterface.bulkDelete('roles', { id: roleId }, { transaction: t });
      }

      await queryInterface.bulkDelete('users', { userName: 'admin' }, { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
};
