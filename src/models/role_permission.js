"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      // pivot model; associations defined in Role/Permission
    }
  }

  RolePermission.init(
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

  return RolePermission;
};
