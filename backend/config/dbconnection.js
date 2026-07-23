const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('skyniche', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

module.exports = sequelize