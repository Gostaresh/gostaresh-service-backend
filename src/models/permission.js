"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.role, {
        through: models.role_permission,
        foreignKey: "permissionID",
        otherKey: "roleID",
        as: "roles",
      });
    }
  }
  permission.init(
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
      modelName: "permission",
      tableName: "permissions",
    }
  );
  return permission;
};
