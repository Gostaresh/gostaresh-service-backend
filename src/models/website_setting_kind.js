"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class website_setting_kind extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.website_setting, {
        foreignKey: "kindID",
        as: "settings",
      });
    }
  }
  website_setting_kind.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "website_setting_kind",
      tableName: "website_setting_kinds",
    }
  );
  return website_setting_kind;
};
