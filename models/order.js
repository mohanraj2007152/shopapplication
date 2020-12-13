const Sequelize = require('sequelize');

const sequelize =require('../util/database');

const Order = sequelize.define('order',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement :true,
        allownull : false,
        primaryKey : true
    },
    // address:{
    //     type :Sequelize.STRING,
    //     allownull:false
    // }
});

module.exports =Order;