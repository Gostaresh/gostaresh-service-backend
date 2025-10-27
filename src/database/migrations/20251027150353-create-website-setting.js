"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("website_settings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.TEXT,
      },
      attribute: {
        type: Sequelize.TEXT,
      },
      href: {
        type: Sequelize.TEXT,
      },
      kindID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "website_setting_kinds", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    // Helpful index for FK lookups
    await queryInterface.addIndex("website_settings", ["kindID"], {
      name: "idx_website_settings_kindID",
    });
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex(
        "website_settings",
        "idx_website_settings_kindID"
      );
    } catch (e) {}
    await queryInterface.dropTable("website_settings");
  },
};
