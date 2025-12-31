"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class policy extends Model {
    static associate(_models) {}
  }

  policy.init(
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
      },
      brand: DataTypes.STRING,
      category: DataTypes.STRING,
      product: DataTypes.STRING,
      durationValue: DataTypes.INTEGER,
      durationUnit: DataTypes.STRING,
      conditions: DataTypes.TEXT,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "policy",
      tableName: "policies",
    }
  );

  return policy;
};
