"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("articles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
      },
      shortContent: {
        type: Sequelize.TEXT,
      },
      longContent: {
        type: Sequelize.TEXT,
      },
      articleTypeID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'article_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      UserID: {
        type: Sequelize.UUID,
      },
      slug: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
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

    // Add index and FK for articleTypeID in the same migration
    await queryInterface.addIndex("articles", ["articleTypeID"], {
      name: "idx_articles_articleTypeID",
    });

    // FK defined inline above; no extra addConstraint needed
  },
  async down(queryInterface, Sequelize) {
    // Remove index before dropping table (safety)
    try { await queryInterface.removeIndex("articles", "idx_articles_articleTypeID"); } catch (e) {}
    await queryInterface.dropTable("articles");
  },
};
