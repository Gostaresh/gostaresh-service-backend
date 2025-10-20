"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class warranty extends Model {
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
      this.belongsTo(models.warranty_policy, {
        foreignKey: "policyID",
        as: "policy",
      });
      this.hasMany(models.warranty_ticket, {
        foreignKey: "warrantyID",
        as: "tickets",
      });
    }
  }
  warranty.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      productID: DataTypes.UUID,
      productSerial: DataTypes.STRING,
      warrantySerial: DataTypes.STRING,
      policyID: DataTypes.UUID,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "warranty",
      tableName: "warranties",
    }
  );
  return warranty;
};
