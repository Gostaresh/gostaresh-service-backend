'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.product, {
        foreignKey: 'brandID',
        as: 'products',
      });
      this.hasMany(models.warranty_policy, {
        foreignKey: 'brandID',
        as: 'warranty_policies',
      });
    }
  }
  brand.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    slug: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'brand',
    tableName: 'brands'
  });
  return brand;
};
