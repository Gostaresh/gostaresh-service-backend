"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class warranty_ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.warranty, {
        foreignKey: "warrantyID",
        as: "warranty",
      });
      this.hasMany(models.warranty_logs, {
        foreignKey: "ticketID",
        as: "logs",
      });
    }
  }
  warranty_ticket.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      ticketNo: DataTypes.STRING,
      warrantyID: DataTypes.UUID,
      customerName: DataTypes.STRING,
      customerPhone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "warranty_ticket",
      tableName: "warranty_tickets",
    }
  );
  return warranty_ticket;
};
