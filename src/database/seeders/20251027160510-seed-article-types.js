"use strict";

const { randomUUID } = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const rows = ["blog", "news", "education"].map((name) => ({
      id: randomUUID(),
      name,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }));
    await queryInterface.bulkInsert("article_types", rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "article_types",
      { name: { [Sequelize.Op.in]: ["blog", "news", "education"] } },
      {}
    );
  },
};

