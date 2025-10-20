"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class role_permission extends Model {
    static associate(models) {
      // pivot model; associations defined in Role/Permission
    }
  }

  role_permission.init(
    {
      roleID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      permissionID: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "role_permission",
      tableName: "role_permissions",
      timestamps: true,
      indexes: [{ fields: ["roleID"] }, { fields: ["permissionID"] }],
    }
  );

  return role_permission;
};
