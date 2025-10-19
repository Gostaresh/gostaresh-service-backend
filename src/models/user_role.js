"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      // pivot model; associations defined in User/Role
    }
  }

  UserRole.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "UserRole",
      tableName: "UserRoles",
      timestamps: true,
      indexes: [
        { fields: ["userId"] },
        { fields: ["roleId"] },
      ],
    }
  );

  return UserRole;
};

