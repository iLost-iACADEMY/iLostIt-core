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
    connectTimeout: 0
});

router.get('/', (req, res) => {
    session = req.headers['authorization']
    sessionBearer = session.split(' ');
    sessionBearerToken = sessionBearer[1];

    const query = 'SELECT * FROM sessions JOIN accounts ON sessions.userkey = accounts.id WHERE token = ?';
    con.query(query, [sessionBearerToken], (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            if (sessionBearerToken == results[0].token && results[0].permission <= 4) {
                if (results[0].permission <= 3) {
                    const sql = "SELECT audit.action, audit.id as auditid, accounts.id as userid, accounts.username as act_by, audit.description, audit.since, items.item_name as dedicated_item_name, items.id as itemid FROM `audit` JOIN accounts ON audit.act_by = accounts.id LEFT JOIN items ON audit.dedicated_item = items.id OR audit.dedicated_item = NULL;"
                    con.query(sql, null, (err, result) => {
                        if (err) throw err;
                        res.json(result)
                    })
                } else {
                    res.status(403).json({
                        "status": "error",
                        "message": "Forbidden"
                    })
                }
            } else {
                res.status(403).json({
                    "status": "error",
                    "message": "Forbidden"
                })
            }
        } else {
            res.status(403).json({
                "status": "error",
                "message": "No items"
            })
        }
    })

})


module.exports = router;