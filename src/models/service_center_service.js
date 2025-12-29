"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class service_center_service extends Model {
    static associate(models) {
      // pivot model; associations defined in service_center/service
    }
  }

  service_center_service.init(
    {
      serviceCenterID: {
        type: DataTypes.STRING(64),
        allowNull: false,
        primaryKey: true,
      },
      serviceID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "service_center_service",
      tableName: "service_center_services",
      timestamps: true,
      indexes: [{ fields: ["serviceCenterID"] }, { fields: ["serviceID"] }],
    }
  );

  return service_center_service;
};
