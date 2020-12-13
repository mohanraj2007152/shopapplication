// const db = require('mysql2');

// const connectionPool = db.createPool({

//    host:'localhost',
//    user:'root',
//    database:'nodedb',
//    password:'root'


// })


const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodedb','root','root',{
   dialect:'mysql',
   host:'localhost'


})

module.exports = sequelize;