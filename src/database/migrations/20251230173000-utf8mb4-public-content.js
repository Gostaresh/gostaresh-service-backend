"use strict";

const TABLE_COLUMNS = {
  product_statuses: [
    { name: "name", type: "VARCHAR(255)", allowNull: false },
  ],
  article_types: [{ name: "name", type: "VARCHAR(255)", allowNull: true }],
  brands: [
    { name: "name", type: "VARCHAR(255)", allowNull: false },
    { name: "description", type: "TEXT", allowNull: true },
    { name: "image", type: "VARCHAR(255)", allowNull: true },
    { name: "slug", type: "VARCHAR(255)", allowNull: false },
    { name: "logo", type: "TEXT", allowNull: true },
    { name: "summary", type: "TEXT", allowNull: true },
  ],
  categories: [
    { name: "name", type: "VARCHAR(255)", allowNull: false },
    { name: "title", type: "VARCHAR(255)", allowNull: true },
    { name: "slug", type: "VARCHAR(255)", allowNull: false },
    { name: "image", type: "TEXT", allowNull: true },
    { name: "summary", type: "TEXT", allowNull: true },
  ],
  products: [
    { name: "name", type: "VARCHAR(255)", allowNull: false },
    { name: "title", type: "VARCHAR(255)", allowNull: true },
    { name: "shortDescription", type: "TEXT", allowNull: true },
    { name: "longDescription", type: "TEXT", allowNull: true },
    { name: "summary", type: "TEXT", allowNull: true },
    { name: "description", type: "TEXT", allowNull: true },
    { name: "slug", type: "VARCHAR(255)", allowNull: false },
    { name: "legacyId", type: "VARCHAR(255)", allowNull: true },
  ],
  galleries: [
    { name: "fileName", type: "VARCHAR(255)", allowNull: false },
    { name: "path", type: "VARCHAR(255)", allowNull: false },
  ],
  articles: [
    { name: "title", type: "VARCHAR(255)", allowNull: false },
    { name: "excerpt", type: "TEXT", allowNull: true },
    { name: "cover", type: "TEXT", allowNull: true },
    { name: "content", type: "TEXT", allowNull: true },
    { name: "shortContent", type: "TEXT", allowNull: true },
    { name: "longContent", type: "TEXT", allowNull: true },
    { name: "slug", type: "VARCHAR(255)", allowNull: false },
  ],
  downloads: [
    { name: "title", type: "VARCHAR(255)", allowNull: false },
    { name: "file", type: "TEXT", allowNull: false },
  ],
  pre_send_tips: [
    { name: "content", type: "TEXT", allowNull: false },
  ],
  policies: [
    { name: "brand", type: "VARCHAR(200)", allowNull: false },
    { name: "category", type: "VARCHAR(200)", allowNull: false },
    { name: "product", type: "VARCHAR(255)", allowNull: true },
    { name: "durationUnit", type: "VARCHAR(50)", allowNull: true },
  ],
  home_features: [
    { name: "title", type: "VARCHAR(255)", allowNull: false },
    { name: "description", type: "TEXT", allowNull: true },
    { name: "icon", type: "VARCHAR(255)", allowNull: true },
    { name: "bg", type: "VARCHAR(100)", allowNull: true },
    { name: "dot", type: "VARCHAR(100)", allowNull: true },
  ],
  hero_slides: [
    { name: "title", type: "VARCHAR(255)", allowNull: false },
    { name: "subtitle", type: "VARCHAR(255)", allowNull: true },
    { name: "description", type: "TEXT", allowNull: true },
    { name: "ctaLabel", type: "VARCHAR(255)", allowNull: true },
    { name: "ctaLink", type: "VARCHAR(500)", allowNull: true },
    { name: "image", type: "TEXT", allowNull: true },
  ],
  home_timeline_items: [
    { name: "title", type: "VARCHAR(255)", allowNull: false },
    { name: "description", type: "TEXT", allowNull: true },
  ],
  quick_contacts: [
    { name: "phone", type: "VARCHAR(100)", allowNull: true },
    { name: "whatsapp", type: "VARCHAR(100)", allowNull: true },
    { name: "email", type: "VARCHAR(200)", allowNull: true },
    { name: "ticket", type: "VARCHAR(200)", allowNull: true },
  ],
  service_stats: [
    { name: "label", type: "VARCHAR(255)", allowNull: false },
    { name: "suffix", type: "VARCHAR(50)", allowNull: true },
  ],
  faq_items: [
    { name: "question", type: "TEXT", allowNull: false },
    { name: "answer", type: "TEXT", allowNull: false },
  ],
  abac_rules: [
    { name: "resource", type: "VARCHAR(200)", allowNull: false },
    { name: "action", type: "VARCHAR(100)", allowNull: false },
    { name: "conditionField", type: "VARCHAR(200)", allowNull: false },
    { name: "conditionOp", type: "VARCHAR(50)", allowNull: false },
    { name: "conditionValue", type: "TEXT", allowNull: false },
  ],
  roles: [
    { name: "name", type: "VARCHAR(255)", allowNull: false },
    { name: "title", type: "VARCHAR(255)", allowNull: true },
  ],
  permissions: [
    { name: "name", type: "VARCHAR(255)", allowNull: false },
    { name: "resource", type: "VARCHAR(255)", allowNull: true },
    { name: "action", type: "VARCHAR(255)", allowNull: true },
  ],
  service_centers: [
    { name: "slug", type: "VARCHAR(200)", allowNull: false },
    { name: "title", type: "VARCHAR(200)", allowNull: false },
    { name: "city", type: "VARCHAR(200)", allowNull: true },
    { name: "tagline", type: "VARCHAR(255)", allowNull: true },
    { name: "summary", type: "TEXT", allowNull: true },
    { name: "image", type: "TEXT", allowNull: true },
  ],
  service_center_contacts: [
    { name: "title", type: "VARCHAR(200)", allowNull: false },
    { name: "value", type: "TEXT", allowNull: false },
  ],
  services: [{ name: "value", type: "VARCHAR(200)", allowNull: false }],
};

async function tableExists(queryInterface, table) {
  const [rows] = await queryInterface.sequelize.query(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :table LIMIT 1",
    { replacements: { table } }
  );
  return Array.isArray(rows) && rows.length > 0;
}

async function alterColumns(queryInterface, table, columns) {
  if (!columns || columns.length === 0) return;
  const clauses = columns.map((column) => {
    const nullClause = column.allowNull ? "NULL" : "NOT NULL";
    return `MODIFY COLUMN \`${column.name}\` ${column.type} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ${nullClause}`;
  });
  await queryInterface.sequelize.query(
    `ALTER TABLE \`${table}\` ${clauses.join(", ")}`
  );
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const [table, columns] of Object.entries(TABLE_COLUMNS)) {
      if (await tableExists(queryInterface, table)) {
        await alterColumns(queryInterface, table, columns);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    return;
  },
};
