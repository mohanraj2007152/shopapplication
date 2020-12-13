 const db = require('mysql2');

 const connectionPool = db.createPool({

    host:'localhost',
    user:'root',
    database:'nodedb',
    password:'root'


 })

 module.exports =connectionPool;