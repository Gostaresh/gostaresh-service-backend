"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Permission, {
        through: models.role_permission,
        foreignKey: "roleID",
        otherKey: "permissionID",
        as: "permissions",
      });
      this.belongsToMany(models.User, {
        through: models.user_role,
        foreignKey: "roleID",
        otherKey: "userID",
        as: "users",
      });
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "role",
      tableName: "roles",
    }
  );
  return Role;
};
