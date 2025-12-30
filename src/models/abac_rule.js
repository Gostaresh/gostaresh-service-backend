"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class abac_rule extends Model {
    static associate(_models) {}
  }

  abac_rule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      resource: DataTypes.STRING,
      action: DataTypes.STRING,
      conditionField: DataTypes.STRING,
      conditionOp: DataTypes.STRING,
      conditionValue: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "abac_rule",
      tableName: "abac_rules",
    }
  );

  return abac_rule;
};
