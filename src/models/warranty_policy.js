"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class warranty_policy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.warranty_provider, {
        foreignKey: "providerID",
        as: "provider",
      });
      this.belongsTo(models.category, {
        foreignKey: "categoryID",
        as: "category",
      });
      this.belongsTo(models.brand, {
        foreignKey: "brandID",
        as: "brand",
      });
      this.hasMany(models.warranty, {
        foreignKey: "policyID",
        as: "warranties",
      });
    }
  }
  warranty_policy.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      providerID: DataTypes.UUID,
      categoryID: DataTypes.UUID,
      brandID: DataTypes.UUID,
      duration: DataTypes.INTEGER,
      policy: DataTypes.TEXT,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "warranty_policy",
      tableName: "warranty_policies",
    }
  );
  return warranty_policy;
};
