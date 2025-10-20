"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    static associate(models) {
      this.belongsTo(models.article_type, {
        foreignKey: "articleTypeID",
        as: "article_types",
      });
      this.belongsTo(models.User, {
        foreignKey: "userID",
        as: "author",
      });
    }
  }

  article.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: DataTypes.STRING,
      shortContent: DataTypes.TEXT,
      longContent: DataTypes.TEXT,
      articleTypeID: DataTypes.UUID,
      userID: DataTypes.UUID,
      slug: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "article",
      tableName: "articles",
    }
  );

  return article;
};
