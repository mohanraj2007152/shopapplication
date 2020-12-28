 const db = require('mysql2');

 const connectionPool = db.createPool({

    host:'localhost',
    user:'root',
    database:'productdb',
    password:'root'


 })

 module.exports =connectionPool;