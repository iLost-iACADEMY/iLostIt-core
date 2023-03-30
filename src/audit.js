const express = require('express')
const router = express.Router()
const mysqlconndet = require('./mysql.json')
const mysql = require('mysql2')

var con = mysql.createConnection({
    host: mysqlconndet.serverhost,
    user: mysqlconndet.username,
    password: mysqlconndet.password,
    database: mysqlconndet.database,
    port: mysqlconndet.port,
    connectTimeout: 99999999
});

router.get('/', (req, res) => 
{
    const que='INSERT INTO audit(action,act_by,description,dedicated_item,since) VALUES(${action},${actBy},${description},${dedicatedItem},${since})';
    
    connection.que(que,(err,result)=>
    {
        if (err) {
            console.error('Error logging audit log', err);
        } else {
            console.log('Successfully logged audit log');
        }

    });
    
})



module.exports = router