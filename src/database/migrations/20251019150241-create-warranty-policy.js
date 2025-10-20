"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("warranty_policies", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      providerID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "warranty_providers", key: "id" },
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
      brandID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "brands", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 12,
      },
      policy: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex("warranty_policies", ["providerID"], {
      name: "idx_warranty_policies_providerID",
    });
    await queryInterface.addIndex("warranty_policies", ["categoryID"], {
      name: "idx_warranty_policies_categoryID",
    });
    await queryInterface.addIndex("warranty_policies", ["brandID"], {
      name: "idx_warranty_policies_brandID",
    });
  },
  async down(queryInterface, Sequelize) {
    try { await queryInterface.removeIndex("warranty_policies", "idx_warranty_policies_brandID"); } catch (e) {}
    try { await queryInterface.removeIndex("warranty_policies", "idx_warranty_policies_categoryID"); } catch (e) {}
    try { await queryInterface.removeIndex("warranty_policies", "idx_warranty_policies_providerID"); } catch (e) {}
    await queryInterface.dropTable("warranty_policies");
  },
};
