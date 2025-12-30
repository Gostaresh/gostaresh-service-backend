"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("downloads", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(64),
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      file: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      updated: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex("downloads", ["sortOrder"], {
      name: "idx_downloads_sortOrder",
    });

    await queryInterface.createTable("pre_send_tips", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex("pre_send_tips", ["sortOrder"], {
      name: "idx_pre_send_tips_sortOrder",
    });

    await queryInterface.createTable("home_features", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      bg: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      dot: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex("home_features", ["sortOrder"], {
      name: "idx_home_features_sortOrder",
    });

    await queryInterface.createTable("hero_slides", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      subtitle: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      ctaLabel: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      ctaLink: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex("hero_slides", ["sortOrder"], {
      name: "idx_hero_slides_sortOrder",
    });

    await queryInterface.createTable("home_timeline_items", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex("home_timeline_items", ["sortOrder"], {
      name: "idx_home_timeline_items_sortOrder",
    });

    await queryInterface.createTable("policies", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(64),
      },
      brand: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      product: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      durationValue: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      durationUnit: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
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

    await queryInterface.createTable("service_stats", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(64),
      },
      label: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      suffix: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex("service_stats", ["sortOrder"], {
      name: "idx_service_stats_sortOrder",
    });

    await queryInterface.createTable("faq_items", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex("faq_items", ["sortOrder"], {
      name: "idx_faq_items_sortOrder",
    });

    await queryInterface.createTable("quick_contacts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      phone: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      whatsapp: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      ticket: {
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

    await queryInterface.createTable("abac_rules", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      resource: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      conditionField: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      conditionOp: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      conditionValue: {
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

  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.removeIndex(
        "faq_items",
        "idx_faq_items_sortOrder"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex(
        "service_stats",
        "idx_service_stats_sortOrder"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex(
        "home_timeline_items",
        "idx_home_timeline_items_sortOrder"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex(
        "hero_slides",
        "idx_hero_slides_sortOrder"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex(
        "home_features",
        "idx_home_features_sortOrder"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex(
        "pre_send_tips",
        "idx_pre_send_tips_sortOrder"
      );
    } catch (e) {}
    try {
      await queryInterface.removeIndex("downloads", "idx_downloads_sortOrder");
    } catch (e) {}

    await queryInterface.dropTable("abac_rules");
    await queryInterface.dropTable("quick_contacts");
    await queryInterface.dropTable("faq_items");
    await queryInterface.dropTable("service_stats");
    await queryInterface.dropTable("policies");
    await queryInterface.dropTable("home_timeline_items");
    await queryInterface.dropTable("hero_slides");
    await queryInterface.dropTable("home_features");
    await queryInterface.dropTable("pre_send_tips");
    await queryInterface.dropTable("downloads");
  },
};
