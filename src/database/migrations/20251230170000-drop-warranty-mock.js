"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DROP TABLE IF EXISTS warranty_mock_records"
    );
    await queryInterface.sequelize.query(
      "DROP TABLE IF EXISTS warranty_mock_meta"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable("warranty_mock_meta", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sourceUpdatedAt: {
        type: Sequelize.DATE,
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

    await queryInterface.createTable("warranty_mock_records", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      serials: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      brand: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      model: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      purchaseDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      expireDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      warrantyValue: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      warrantyUnit: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      serviceCenter: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      statusCurrent: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      statusHistory: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      policyRefBrand: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      policyRefCategory: {
        type: Sequelize.STRING(200),
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
  },
};
