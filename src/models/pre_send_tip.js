"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class pre_send_tip extends Model {
    static associate(_models) {}
  }

  pre_send_tip.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      content: DataTypes.TEXT,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "pre_send_tip",
      tableName: "pre_send_tips",
    }
  );

  return pre_send_tip;
};
