"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: "createdBy",
        as: "creator",
      });
      this.belongsTo(models.product_status, {
        foreignKey: "statusID",
        as: "status",
      });
      this.belongsTo(models.brand, {
        foreignKey: "brandID",
        as: "brand",
      });
      this.belongsTo(models.category, {
        foreignKey: "categoryID",
        as: "category",
      });
      this.hasMany(models.gallery, {
        foreignKey: "productID",
        as: "galleries",
      });
      this.hasMany(models.warranty, {
        foreignKey: "productID",
        as: "warranties",
      });
    }
  }
  product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      shortDescription: DataTypes.TEXT,
      longDescription: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      createdBy: DataTypes.UUID,
      statusID: DataTypes.UUID,
      brandID: DataTypes.UUID,
      categoryID: DataTypes.UUID,
      slug: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "product",
      tableName: "products",
    }
  );
  return product;
};
