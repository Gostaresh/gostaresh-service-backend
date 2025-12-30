"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class faq_item extends Model {
    static associate(_models) {}
  }

  faq_item.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      question: DataTypes.TEXT,
      answer: DataTypes.TEXT,
      sortOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "faq_item",
      tableName: "faq_items",
    }
  );

  return faq_item;
};
