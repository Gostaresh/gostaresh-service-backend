"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    static associate(models) {
      this.belongsTo(models.category, {
        foreignKey: "parentID",
        as: "parent",
      });
      this.hasMany(models.category, {
        foreignKey: "parentID",
        as: "children",
      });
      this.hasMany(models.product, {
        foreignKey: "categoryID",
        as: "products",
      });
      this.hasMany(models.warranty_policy, {
        foreignKey: "categoryID",
        as: "warranty_policies",
      });
    }
  }

  category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      title: DataTypes.STRING,
      parentID: DataTypes.UUID,
      slug: DataTypes.STRING,
      image: DataTypes.TEXT,
      summary: DataTypes.TEXT,
      tags: DataTypes.JSON,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "category",
      tableName: "categories",
    }
  );

  return category;
};
