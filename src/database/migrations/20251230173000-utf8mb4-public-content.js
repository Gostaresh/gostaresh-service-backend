"use strict";

const TABLES = [
  "product_statuses",
  "article_types",
  "brands",
  "categories",
  "products",
  "galleries",
  "articles",
  "downloads",
  "pre_send_tips",
  "policies",
  "home_features",
  "hero_slides",
  "home_timeline_items",
  "quick_contacts",
  "service_stats",
  "faq_items",
  "abac_rules",
  "roles",
  "permissions",
  "role_permissions",
  "service_centers",
  "service_center_contacts",
  "services",
  "service_center_services",
];

async function tableExists(queryInterface, table) {
  const [rows] = await queryInterface.sequelize.query(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :table LIMIT 1",
    { replacements: { table } }
  );
  return Array.isArray(rows) && rows.length > 0;
}

async function convertTable(queryInterface, table) {
  await queryInterface.sequelize.query(
    `ALTER TABLE \`${table}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of TABLES) {
      if (await tableExists(queryInterface, table)) {
        await convertTable(queryInterface, table);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    return;
  },
};
