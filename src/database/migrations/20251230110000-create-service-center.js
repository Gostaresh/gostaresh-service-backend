"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("service_centers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(64),
        defaultValue: Sequelize.UUIDV4,
      },
      slug: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(200),
      },
      tagline: {
        type: Sequelize.STRING(255),
      },
      summary: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.TEXT,
      },
      primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex("service_centers", ["slug"], {
      name: "idx_service_centers_slug",
      unique: true,
    });

    await queryInterface.createTable("service_center_contacts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      serviceCenterID: {
        type: Sequelize.STRING(64),
        allowNull: false,
        references: { model: "service_centers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      value: {
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
    await queryInterface.addIndex(
      "service_center_contacts",
      ["serviceCenterID"],
      { name: "idx_service_center_contacts_center" }
    );

    await queryInterface.createTable("services", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      value: {
        type: Sequelize.STRING(200),
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
    await queryInterface.addIndex("services", ["value"], {
      name: "idx_services_value_unique",
      unique: true,
    });

    await queryInterface.createTable("service_center_services", {
      serviceCenterID: {
        type: Sequelize.STRING(64),
        allowNull: false,
        primaryKey: true,
        references: { model: "service_centers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      serviceID: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "services", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.addIndex(
      "service_center_services",
      ["serviceCenterID"],
      { name: "idx_service_center_services_center" }
    );
    await queryInterface.addIndex("service_center_services", ["serviceID"], {
      name: "idx_service_center_services_service",
    });
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex(
        "service_center_services",
        "idx_service_center_services_service"
      );
      await queryInterface.removeIndex(
        "service_center_services",
        "idx_service_center_services_center"
      );
      await queryInterface.removeIndex(
        "service_center_contacts",
        "idx_service_center_contacts_center"
      );
      await queryInterface.removeIndex("services", "idx_services_value_unique");
      await queryInterface.removeIndex(
        "service_centers",
        "idx_service_centers_slug"
      );
    } catch (e) {}
    await queryInterface.dropTable("service_center_services");
    await queryInterface.dropTable("service_center_contacts");
    await queryInterface.dropTable("services");
    await queryInterface.dropTable("service_centers");
  },
};
