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

    await queryInterface.addIndex("warranty_tickets", ["warrantyID"], {
      name: "idx_warranty_tickets_warrantyID",
    });
    await queryInterface.addIndex("warranty_tickets", ["ticketNo"], {
      name: "idx_warranty_tickets_ticketNo",
    });
  },
  async down(queryInterface, Sequelize) {
    try { await queryInterface.removeIndex("warranty_tickets", "idx_warranty_tickets_ticketNo"); } catch (e) {}
    try { await queryInterface.removeIndex("warranty_tickets", "idx_warranty_tickets_warrantyID"); } catch (e) {}
    await queryInterface.dropTable("warranty_tickets");
  },
};
