"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SMS_Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SMS_Log.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      phone: { type: DataTypes.INTEGER, allowNull: false },
      text: DataTypes.TEXT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SMS_Log",
    }
  );
  return SMS_Log;
};
