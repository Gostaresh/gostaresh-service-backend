"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
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
      shortDescription: {
        type: Sequelize.TEXT,
      },
      longDescription: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      statusID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "product_statuses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      brandID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "brands", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      categoryID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
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

    await queryInterface.addIndex("products", ["createdBy"], {
      name: "idx_products_createdBy",
    });
    await queryInterface.addIndex("products", ["statusID"], {
      name: "idx_products_statusID",
    });
    await queryInterface.addIndex("products", ["brandID"], {
      name: "idx_products_brandID",
    });
    await queryInterface.addIndex("products", ["categoryID"], {
      name: "idx_products_categoryID",
    });
    await queryInterface.addIndex("products", ["slug"], {
      name: "idx_products_slug",
    });
  },
  async down(queryInterface, Sequelize) {
    try { await queryInterface.removeIndex("products", "idx_products_slug"); } catch (e) {}
    try { await queryInterface.removeIndex("products", "idx_products_categoryID"); } catch (e) {}
    try { await queryInterface.removeIndex("products", "idx_products_brandID"); } catch (e) {}
    try { await queryInterface.removeIndex("products", "idx_products_statusID"); } catch (e) {}
    try { await queryInterface.removeIndex("products", "idx_products_createdBy"); } catch (e) {}
    await queryInterface.dropTable("products");
  },
};
