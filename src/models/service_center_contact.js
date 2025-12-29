"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class service_center_contact extends Model {
    static associate(models) {
      this.belongsTo(models.service_center, {
        foreignKey: "serviceCenterID",
        as: "serviceCenter",
      });
    }
  }

  service_center_contact.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      serviceCenterID: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "service_center_contact",
      tableName: "service_center_contacts",
    }
  );

  return service_center_contact;
};
