"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class home_feature extends Model {
    static associate(_models) {}
  }

  home_feature.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      icon: DataTypes.STRING,
      bg: DataTypes.STRING,
      dot: DataTypes.STRING,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "home_feature",
      tableName: "home_features",
    }
  );

  return home_feature;
};
