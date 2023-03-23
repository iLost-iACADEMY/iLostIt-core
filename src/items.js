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

router.get('/', (req, res) => {
    con.connect()

    var sql = "SELECT * FROM `items`";

    con.query(sql, function (err, result) {
        if (err) throw err;
        res.json(result)
    })

})

module.exports = router