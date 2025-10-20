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
        allowNull: false,
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
        references: { model: "article_types", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      userID: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
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

    // Add index and FK for articleTypeID in the same migration
    await queryInterface.addIndex("articles", ["articleTypeID"], {
      name: "idx_articles_articleTypeID",
    });

    // Additional helpful indexes
    await queryInterface.addIndex("articles", ["UserID"], {
      name: "idx_articles_userID",
    });
    await queryInterface.addIndex("articles", ["slug"], {
      name: "idx_articles_slug",
    });

    // FK defined inline above; no extra addConstraint needed
  },
  async down(queryInterface, Sequelize) {
    // Remove index before dropping table (safety)
    try {
      await queryInterface.removeIndex(
        "articles",
        "idx_articles_articleTypeID"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex("articles", "idx_articles_userID");
    } catch (e) {}
    try {
      await queryInterface.removeIndex("articles", "idx_articles_slug");
    } catch (e) {}
    await queryInterface.dropTable("articles");
  },
};
