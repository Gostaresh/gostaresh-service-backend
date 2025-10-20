"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.product, {
        foreignKey: "productID",
        as: "product",
      });
    }
  }
  gallery.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      fileName: DataTypes.STRING,
      path: DataTypes.STRING,
      productID: DataTypes.UUID,
      isMain: DataTypes.BOOLEAN,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "gallery",
      tableName: "galleries",
    }
  );
  return gallery;
};
