"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("warranty_logs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      ticketID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "warranty_tickets", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      userID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      stateID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "warranty_states", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
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

    await queryInterface.addIndex("warranty_logs", ["ticketID"], {
      name: "idx_warranty_logs_ticketID",
    });
    await queryInterface.addIndex("warranty_logs", ["userID"], {
      name: "idx_warranty_logs_userID",
    });
    await queryInterface.addIndex("warranty_logs", ["stateID"], {
      name: "idx_warranty_logs_stateID",
    });
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex(
        "warranty_logs",
        "idx_warranty_logs_stateID"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex(
        "warranty_logs",
        "idx_warranty_logs_userID"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex(
        "warranty_logs",
        "idx_warranty_logs_ticketID"
      );
    } catch (e) {}
    await queryInterface.dropTable("warranty_logs");
  },
};
