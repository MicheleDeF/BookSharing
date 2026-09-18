'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Statistic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Statistic.belongsTo(models.User, 
        { 
          as: 'user', 
          foreignKey: 'userId' 
        });
      Statistic.belongsTo(models.Book, 
        { 
          as: 'book', 
          foreignKey: 'bookId' 
        });
    }
  }
  Statistic.init({
    views: DataTypes.INTEGER,
    contacts: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Statistic',
  });
  return Statistic;
};