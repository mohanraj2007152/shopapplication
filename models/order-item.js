const Sequelize = require('sequelize');

const sequelize =require('../util/database');

const OrderItem = sequelize.define('orderItem',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement :true,
        allownull : false,
        primaryKey : true
    },
    quantity:{
        type :Sequelize.INTEGER,
        allownull:false
    }
});

module.exports =OrderItem;