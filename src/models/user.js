"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: "userID",
        otherKey: "roleId",
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

  User.init(
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

  return User;
};
