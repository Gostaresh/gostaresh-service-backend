"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("brands", "logo", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("brands", "summary", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("brands", "tags", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("categories", "title", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("categories", "image", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("categories", "summary", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("categories", "tags", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("products", "title", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("products", "summary", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("products", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("products", "features", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("products", "tags", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("products", "featured", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("products", "legacyId", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("articles", "excerpt", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("articles", "cover", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("articles", "date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn("articles", "readMinutes", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("articles", "tags", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("articles", "hot", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("articles", "content", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("roles", "title", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("permissions", "resource", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("permissions", "action", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("permissions", "action");
    await queryInterface.removeColumn("permissions", "resource");
    await queryInterface.removeColumn("roles", "title");

    await queryInterface.removeColumn("articles", "content");
    await queryInterface.removeColumn("articles", "hot");
    await queryInterface.removeColumn("articles", "tags");
    await queryInterface.removeColumn("articles", "readMinutes");
    await queryInterface.removeColumn("articles", "date");
    await queryInterface.removeColumn("articles", "cover");
    await queryInterface.removeColumn("articles", "excerpt");

    await queryInterface.removeColumn("products", "legacyId");
    await queryInterface.removeColumn("products", "featured");
    await queryInterface.removeColumn("products", "tags");
    await queryInterface.removeColumn("products", "features");
    await queryInterface.removeColumn("products", "description");
    await queryInterface.removeColumn("products", "summary");
    await queryInterface.removeColumn("products", "title");

    await queryInterface.removeColumn("categories", "tags");
    await queryInterface.removeColumn("categories", "summary");
    await queryInterface.removeColumn("categories", "image");
    await queryInterface.removeColumn("categories", "title");

    await queryInterface.removeColumn("brands", "tags");
    await queryInterface.removeColumn("brands", "summary");
    await queryInterface.removeColumn("brands", "logo");
  },
};
