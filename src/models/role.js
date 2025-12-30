"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.permission, {
        through: models.role_permission,
        foreignKey: "roleID",
        otherKey: "permissionID",
        as: "permissions",
      });
      this.belongsToMany(models.user, {
        through: models.user_role,
        foreignKey: "roleID",
        otherKey: "userID",
        as: "users",
      });
    }
  }
  role.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "role",
      tableName: "roles",
    }
  );
  return role;
};
