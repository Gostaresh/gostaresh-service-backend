"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      parentID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "categories", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
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

    await queryInterface.addIndex("categories", ["parentID"], {
      name: "idx_categories_parentID",
    });
    await queryInterface.addIndex("categories", ["slug"], {
      name: "idx_categories_slug",
    });
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex("categories", "idx_categories_slug");
    } catch (e) {}
    try {
      await queryInterface.removeIndex("categories", "idx_categories_parentID");
    } catch (e) {}
    await queryInterface.dropTable("categories");
  },
};
