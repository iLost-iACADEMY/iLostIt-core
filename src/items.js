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

    var sql = "SELECT * FROM `items` JOIN `accounts` ON items.foundlost_by = accounts.id;";

    con.query(sql, function (err, result) {
        if (err) throw err;

        try {
            session = req.headers['authorization']
            sessionBearer = session.split(' ');
            sessionBearerToken = sessionBearer[1];

            const query = 'SELECT * FROM sessions JOIN accounts ON sessions.userkey = accounts.id WHERE token = ?';
            con.query(query, [sessionBearerToken], (error, results, fields) => {
                if (error) throw error;
                if (results.length > 0) {
                    if (sessionBearerToken == results[0].token && results[0].permission <= 4) {
                        res.json(result) // User Has Permission
                    } else {
                        res.status(403).json({
                            "status": "error",
                            "message": "Invalid token"
                        })
                    }
                } else {
                    res.status(403).json({
                        "status": "error",
                        "message": "Forbidden"
                    })
                }
            })
        } catch (e) {
            res.status(403).json({
                "status": "error",
                "message": "Forbidden"
            })
        }
    })

})

module.exports = router