"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class service_stat extends Model {
    static associate(_models) {}
  }

  service_stat.init(
    {
      id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
      },
      label: DataTypes.STRING,
      value: DataTypes.INTEGER,
      suffix: DataTypes.STRING,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "service_stat",
      tableName: "service_stats",
    }
  );

  return service_stat;
};
