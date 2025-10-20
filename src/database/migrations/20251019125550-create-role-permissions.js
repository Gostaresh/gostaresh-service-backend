"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("role_permissions", {
      roleID: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "roles", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      permissionID: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "permissions", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("role_permissions", ["roleID"], {
      name: "idx_role_permissions_roleID",
    });
    await queryInterface.addIndex("role_permissions", ["permissionID"], {
      name: "idx_role_permissions_permissionID",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("role_permissions");
  },
};
