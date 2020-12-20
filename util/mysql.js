 const db = require('mysql2');

 const connectionPool = db.createPool({

    host:'localhost',
    user:'root',
    database:'apidb',
    password:'root'


 })

 module.exports =connectionPool;