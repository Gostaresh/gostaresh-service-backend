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
      userID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      roleID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "user_role",
      tableName: "user_roles",
      timestamps: true,
      indexes: [{ fields: ["userID"] }, { fields: ["roleID"] }],
    }
  );

  return UserRole;
};
