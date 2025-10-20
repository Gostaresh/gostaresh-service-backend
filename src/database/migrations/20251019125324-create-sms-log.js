"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sms_logs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      phone: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "sent",
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
    await queryInterface.addIndex("sms_logs", ["phone"], {
      name: "idx_sms_logs_phone",
    });
    await queryInterface.addIndex("sms_logs", ["status"], {
      name: "idx_sms_logs_status",
    });
  },
  async down(queryInterface, Sequelize) {
    try { await queryInterface.removeIndex("sms_logs", "idx_sms_logs_status"); } catch (e) {}
    try { await queryInterface.removeIndex("sms_logs", "idx_sms_logs_phone"); } catch (e) {}
    await queryInterface.dropTable("sms_logs");
  },
};
