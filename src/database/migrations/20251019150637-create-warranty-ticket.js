"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("warranty_tickets", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      ticketNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      warrantyID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "warranties", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      customerName: {
        type: Sequelize.STRING,
      },
      customerPhone: {
        type: Sequelize.STRING,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("warranty_tickets");
  },
};
