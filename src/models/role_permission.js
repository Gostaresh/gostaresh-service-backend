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
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "RolePermissions",
      timestamps: true,
      indexes: [
        { fields: ["roleId"] },
        { fields: ["permissionId"] },
      ],
    }
  );

  return RolePermission;
};

