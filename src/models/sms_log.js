"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sms_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sms_log.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      phone: { type: DataTypes.STRING, allowNull: false },
      text: DataTypes.TEXT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "sms_log",
      tableName: "sms_logs",
    }
  );
  return sms_log;
};
