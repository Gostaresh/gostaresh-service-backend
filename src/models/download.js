"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class download extends Model {
    static associate(_models) {}
  }

  download.init(
    {
      id: {
        type: DataTypes.STRING(64),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: DataTypes.STRING,
      file: DataTypes.TEXT,
      updated: DataTypes.DATEONLY,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "download",
      tableName: "downloads",
    }
  );

  return download;
};
