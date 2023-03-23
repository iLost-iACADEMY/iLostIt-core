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
    port: mysqlconndet.port,
    connectTimeout: 99999999
});

router.get('/', (req, res) => {
    con.connect()

    var sql = "";

    res.json({
        "status": "success",
    })
})

router.post('/register', (req, res) => {
    con.connect()

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

    const { username, password, confirmpassword } = req.body
    const query = 'INSERT INTO accounts (username, password, permission) VALUES(?, ?, ?)';
    if (password == confirmpassword) {
        con.query(query, [username, hash, "4"], (error, results, fields) => {
            if (error) throw error;
            res.json("Registered! Welcome to iLost");
        })
    } else {
        res.status(403).json("Password doesn't match")
    }
})

module.exports = router