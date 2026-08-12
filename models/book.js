'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.User, {
        foreignKey: 'userId'        
      });
    }
  }
  Book.init({
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    publish_year: DataTypes.NUMBER,
    category: DataTypes.STRING,
    reg_address: DataTypes.STRING,
    reg_radius: DataTypes.STRING,
    lat: DataTypes.STRING,
    lon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};