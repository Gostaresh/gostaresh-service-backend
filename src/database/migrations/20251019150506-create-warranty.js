"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("warranties", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      productID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      productSerial: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      warrantySerial: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      policyID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "warranty_policies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      endDate: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex("warranties", ["productID"], {
      name: "idx_warranties_productID",
    });
    await queryInterface.addIndex("warranties", ["policyID"], {
      name: "idx_warranties_policyID",
    });
  },
  async down(queryInterface, Sequelize) {
    try { await queryInterface.removeIndex("warranties", "idx_warranties_policyID"); } catch (e) {}
    try { await queryInterface.removeIndex("warranties", "idx_warranties_productID"); } catch (e) {}
    await queryInterface.dropTable("warranties");
  },
};
