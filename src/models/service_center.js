"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class service_center extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.service_center_contact, {
        foreignKey: "serviceCenterID",
        as: "contacts",
      });
      this.belongsToMany(models.service, {
        through: models.service_center_service,
        foreignKey: "serviceCenterID",
        otherKey: "serviceID",
        as: "services",
      });
    }
  }
  service_center.init(
    {
      id: {
        type: DataTypes.STRING(64),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      city: DataTypes.STRING(200),
      tagline: DataTypes.STRING(255),
      summary: DataTypes.TEXT,
      image: DataTypes.TEXT,
      primary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "service_center",
      tableName: "service_centers",
    }
  );
  return service_center;
};
