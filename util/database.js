const Sequelize = require('sequelize');

const sequelize = new Sequelize('apidb','root','root',{
   dialect:'mysql',
   host:'localhost'


})

module.exports = sequelize;