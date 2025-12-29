"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class service extends Model {
    static associate(models) {
      this.belongsToMany(models.service_center, {
        through: models.service_center_service,
        foreignKey: "serviceID",
        otherKey: "serviceCenterID",
        as: "serviceCenters",
      });
    }
  }

  service.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "service",
      tableName: "services",
    }
  );

  return service;
};
