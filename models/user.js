'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    User.hasMany(models.Book, {
      foreignKey: 'userId',
      as: 'books'
    });
     User.hasMany(models.Message, { 
        as: 'SentMessages', 
        foreignKey: 'senderId' 
      });
      User.hasMany(models.Message, { 
        as: 'RecipientMessages', 
        foreignKey: 'recipientId' 
      });
      User.hasMany(models.Statistic, { 
        as: 'statistic', 
        foreignKey: 'userId' 
      });
    }
  }
  User.init({
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    description: DataTypes.TEXT,
    avatar: DataTypes.TEXT,
    password_hash: DataTypes.STRING,
    address: DataTypes.STRING,
    radius: DataTypes.ENUM('500'),
    lon: DataTypes.STRING,
    lat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};