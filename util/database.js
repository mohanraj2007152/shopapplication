const Sequelize = require('sequelize');

const sequelize = new Sequelize('productdb','root','root',{
   dialect:'mysql',
   host:'localhost'


})

module.exports = sequelize;