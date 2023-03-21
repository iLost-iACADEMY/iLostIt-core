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

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var sql = `INSERT INTO 'accounts' ('id', 'username', 'password', 'permission') VALUES (?, ?, ?, ?);`;
    
    res.json({
        "status": "success"
    })

    con.end()
})


module.exports = router