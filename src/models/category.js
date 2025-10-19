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
      parentID: DataTypes.UUID,
      slug: DataTypes.STRING,
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

