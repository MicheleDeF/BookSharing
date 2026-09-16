'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderId' });
      Message.belongsTo(models.User, { as: 'Recipient', foreignKey: 'recipientId' });
    }
  }
  Message.init({
    content: DataTypes.TEXT,
    senderId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};