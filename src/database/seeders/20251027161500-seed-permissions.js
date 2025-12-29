"use strict";

const { randomUUID, createHash } = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const names = [
      // users
      "user.read",
      "user.create",
      "user.update",
      "user.delete",
      // products
      "product.read",
      "product.create",
      "product.update",
      "product.delete",
      // categories
      "category.read",
      "category.create",
      "category.update",
      "category.delete",
      // brands
      "brand.read",
      "brand.create",
      "brand.update",
      "brand.delete",
      // galleries
      "gallery.read",
      "gallery.create",
      "gallery.update",
      "gallery.delete",
      // articles
      "article.read",
      "article.create",
      "article.update",
      "article.delete",
      // article types
      "article_type.read",
      "article_type.create",
      "article_type.update",
      "article_type.delete",
      // RBAC
      "permission.read",
      "role.read",
      "role.create",
      "role.update",
      "role.delete",
      "role_permission.update",
      "user_role.update",
      // product statuses
      "product_status.read",
      // service centers
      "service_center.read",
      "service_center.create",
      "service_center.update",
      "service_center.delete",
      // website settings
      "website_setting.read",
      "website_setting.create",
      "website_setting.update",
      "website_setting.delete",
      // website setting kinds
      "website_setting_kind.read",
      "website_setting_kind.create",
      "website_setting_kind.update",
      "website_setting_kind.delete",
    ];

    // fetch existing
    const [existing] = await queryInterface.sequelize.query(
      'SELECT name FROM permissions'
    );
    const have = new Set((existing || []).map((x) => x.name));
    const toInsert = names.filter((n) => !have.has(n));
    if (toInsert.length) {
      await queryInterface.bulkInsert(
        "permissions",
        toInsert.map((name) => ({ id: randomUUID(), name, createdAt: now, updatedAt: now })),
        {}
      );
    }

    // attach all permissions to superadmin if role exists
    const [[role]] = await queryInterface.sequelize.query(
      'SELECT id FROM roles WHERE name = :name LIMIT 1',
      { replacements: { name: 'superadmin' } }
    );
    if (role && role.id) {
      const roleId = role.id;
      const [perms] = await queryInterface.sequelize.query('SELECT id FROM permissions');
      const [attached] = await queryInterface.sequelize.query(
        'SELECT permissionID AS id FROM role_permissions WHERE roleID = :roleId',
        { replacements: { roleId } }
      );
      const attachedSet = new Set((attached || []).map((x) => x.id));
      const toAttach = (perms || []).filter((p) => !attachedSet.has(p.id));
      if (toAttach.length) {
        await queryInterface.bulkInsert(
          'role_permissions',
          toAttach.map((p) => ({ roleID: roleId, permissionID: p.id, createdAt: now, updatedAt: now })),
          {}
        );
      }
    } else {
      // Ensure superadmin role exists if not
      const roleId = randomUUID();
      await queryInterface.bulkInsert(
        'roles',
        [{ id: roleId, name: 'superadmin', createdAt: now, updatedAt: now }],
        {}
      );
      const [perms] = await queryInterface.sequelize.query('SELECT id FROM permissions');
      if (perms && perms.length) {
        await queryInterface.bulkInsert(
          'role_permissions',
          perms.map((p) => ({ roleID: roleId, permissionID: p.id, createdAt: now, updatedAt: now })),
          {}
        );
      }
    }

    // Ensure admin user exists and is bound to superadmin
    const [[admin]] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE userName = :userName LIMIT 1',
      { replacements: { userName: 'admin' } }
    );
    let adminId = admin && admin.id;
    if (!adminId) {
      adminId = randomUUID();
      const passwordHash = createHash('sha256').update('admin').digest('hex');
      await queryInterface.bulkInsert(
        'users',
        [{ id: adminId, firstName: 'Super', lastName: 'Admin', userName: 'admin', password: passwordHash, isActive: true, createdAt: now, updatedAt: now }],
        {}
      );
    }

    const [[saRole]] = await queryInterface.sequelize.query(
      'SELECT id FROM roles WHERE name = :name LIMIT 1',
      { replacements: { name: 'superadmin' } }
    );
    if (saRole && saRole.id && adminId) {
      const [[binding]] = await queryInterface.sequelize.query(
        'SELECT 1 FROM user_roles WHERE userID = :userId AND roleID = :roleId LIMIT 1',
        { replacements: { userId: adminId, roleId: saRole.id } }
      );
      if (!binding) {
        await queryInterface.bulkInsert(
          'user_roles',
          [{ userID: adminId, roleID: saRole.id, createdAt: now, updatedAt: now }],
          {}
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const names = [
      "user.read","user.create","user.update","user.delete",
      "product.read","product.create","product.update","product.delete",
      "category.read","category.create","category.update","category.delete",
      "brand.read","brand.create","brand.update","brand.delete",
      "gallery.read","gallery.create","gallery.update","gallery.delete",
      "article.read","article.create","article.update","article.delete",
      "article_type.read","article_type.create","article_type.update","article_type.delete",
      "permission.read","role.read","role.create","role.update","role.delete","role_permission.update","user_role.update",
      "product_status.read",
      "service_center.read",
      "service_center.create",
      "service_center.update",
      "service_center.delete",
      "website_setting.read","website_setting.create","website_setting.update","website_setting.delete",
      "website_setting_kind.read","website_setting_kind.create","website_setting_kind.update","website_setting_kind.delete",
    ];
    await queryInterface.bulkDelete(
      'permissions',
      { name: { [Sequelize.Op.in]: names } },
      {}
    );
  },
};
