const express = require('express')
const router = express.Router()
const mysqlconndet = require('./mysql.json')
const mysql = require('mysql2')
var bcrypt = require('bcryptjs');


var con = mysql.createConnection({
    host: mysqlconndet.serverhost,
    user: mysqlconndet.username,
    password: mysqlconndet.password,
    database: mysqlconndet.database,
    port: mysqlconndet.port
});

router.get('/', (req, res) => {
    con.connect()

    var sql = "";

    res.json({
        "status": "success",
    })

    con.end()
})

router.post('/join', (req, res) => {
    con.connect()

    var sql = "INSERT";
    
    res.json({
        "status": "success"
    })

    con.end()
})


module.exports = router