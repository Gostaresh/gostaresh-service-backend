"use strict";

const TABLE_NAME = "policies";
const COLUMN_NAME = "conditions";

async function columnExists(queryInterface) {
  const [rows] = await queryInterface.sequelize.query(
    "SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = :table AND column_name = :column LIMIT 1",
    { replacements: { table: TABLE_NAME, column: COLUMN_NAME } }
  );
  return Array.isArray(rows) && rows.length > 0;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (await columnExists(queryInterface)) return;
    await queryInterface.sequelize.query(
      `ALTER TABLE \`${TABLE_NAME}\` ADD COLUMN \`${COLUMN_NAME}\` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL AFTER \`durationUnit\``
    );
  },

  async down(queryInterface, Sequelize) {
    if (!(await columnExists(queryInterface))) return;
    await queryInterface.removeColumn(TABLE_NAME, COLUMN_NAME);
  },
};
