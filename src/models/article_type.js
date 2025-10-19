'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class article_type extends Model {
    static associate(models) {
      this.hasMany(models.article, {
        foreignKey: 'articleTypeID',
        as: 'articles',
      });
    }
  }
  article_type.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'article_type',
      tableName: 'article_types',
    }
  );
  return article_type;
};
