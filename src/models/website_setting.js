"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class website_setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.website_setting_kind, {
        foreignKey: "kindID",
        as: "kind",
      });
    }
  }
  website_setting.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.TEXT,
      attribute: DataTypes.TEXT,
      href: DataTypes.TEXT,
      kindID: { type: DataTypes.UUID, allowNull: false },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "website_setting",
      tableName: "website_settings",
    }
  );
  return website_setting;
};
