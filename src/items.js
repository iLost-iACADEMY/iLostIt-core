const express = require('express')
const router = express.Router()
const mysqlconndet = require('./mysql.json')
const mysql = require('mysql2')

var con = mysql.createConnection({
    host: mysqlconndet.serverhost,
    user: mysqlconndet.username,
    password: mysqlconndet.password,
    database: mysqlconndet.database,
    port: mysqlconndet.port
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected for Items!");
});
  

router.get('/', (req, res) => {

})

module.exports = router