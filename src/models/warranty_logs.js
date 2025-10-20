"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class warranty_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.warranty_ticket, {
        foreignKey: "ticketID",
        as: "ticket",
      });
      this.belongsTo(models.user, {
        foreignKey: "userID",
        as: "user",
      });
      this.belongsTo(models.warranty_state, {
        foreignKey: "stateID",
        as: "state",
      });
    }
  }
  warranty_logs.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      ticketID: DataTypes.UUID,
      userID: DataTypes.UUID,
      stateID: DataTypes.UUID,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "warranty_logs",
      tableName: "warranty_logs",
    }
  );
  return warranty_logs;
};
