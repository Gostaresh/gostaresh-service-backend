"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class quick_contact extends Model {
    static associate(_models) {}
  }

  quick_contact.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      phone: DataTypes.STRING,
      whatsapp: DataTypes.STRING,
      email: DataTypes.STRING,
      ticket: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "quick_contact",
      tableName: "quick_contacts",
    }
  );

  return quick_contact;
};
