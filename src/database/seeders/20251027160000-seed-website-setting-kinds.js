"use strict";

const crypto = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();
      const names = [
        "Herobanner",
        "StatsStrip",
        "Features",
        "FooterLicense",
        "FooterLinks",
        "FooterBanner",
        "AboutUsBody",
        "AboutUsItem",
        "AboutUsAddress",
        "AboutUsPhone",
      ];

      const [existingRows] = await queryInterface.sequelize.query(
        "SELECT name FROM website_setting_kinds WHERE name IN (:names)",
        { replacements: { names }, transaction: t }
      );
      const existing = new Set((existingRows || []).map((r) => r.name));
      const toInsert = names.filter((n) => !existing.has(n));

      if (toInsert.length > 0) {
        await queryInterface.bulkInsert(
          "website_setting_kinds",
          toInsert.map((name) => ({
            id: crypto.randomUUID(),
            name,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          })),
          { transaction: t }
        );
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      const names = [
        "Herobanner",
        "StatsStrip",
        "Features",
        "FooterLicense",
        "FooterLinks",
        "FooterBanner",
        "AboutUsBody",
        "AboutUsItem",
        "AboutUsAddress",
        "AboutUsPhone",
      ];
      await queryInterface.bulkDelete(
        "website_setting_kinds",
        { name: names },
        { transaction: t }
      );
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
};

