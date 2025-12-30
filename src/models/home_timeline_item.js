"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class home_timeline_item extends Model {
    static associate(_models) {}
  }

  home_timeline_item.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "home_timeline_item",
      tableName: "home_timeline_items",
    }
  );

  return home_timeline_item;
};
