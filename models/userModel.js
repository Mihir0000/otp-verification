const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.BIGINT, allowNull: true, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});
module.exports = User;
