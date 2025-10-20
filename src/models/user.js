"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      this.belongsToMany(models.role, {
        through: models.user_role,
        foreignKey: "userID",
        otherKey: "roleID",
        as: "roles",
      });
      this.hasMany(models.article, {
        foreignKey: "userID",
        as: "articles",
      });
      this.hasMany(models.product, {
        foreignKey: "createdBy",
        as: "products",
      });
      this.hasMany(models.warranty_logs, {
        foreignKey: "userID",
        as: "warrantyLogs",
      });
    }
  }

  user.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "user",
      tableName: "users",
    }
  );

  return user;
};
