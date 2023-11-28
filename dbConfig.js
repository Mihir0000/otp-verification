const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  database: 'test_db',
  username: 'root',
  password: '',
  host: 'localhost',
  dialect: 'mysql',
});
module.exports = sequelize;
