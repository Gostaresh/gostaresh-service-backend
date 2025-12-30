"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class hero_slide extends Model {
    static associate(_models) {}
  }

  hero_slide.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      description: DataTypes.TEXT,
      ctaLabel: DataTypes.STRING,
      ctaLink: DataTypes.STRING,
      image: DataTypes.TEXT,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "hero_slide",
      tableName: "hero_slides",
    }
  );

  return hero_slide;
};
