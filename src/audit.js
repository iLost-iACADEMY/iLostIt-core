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
    const sql = "SELECT audit.id as auditid, accounts.id as userid, accounts.username as act_by, audit.description, audit.since, items.item_name as dedicated_item_name, items.id as itemid FROM `audit` JOIN accounts ON audit.act_by = accounts.id LEFT JOIN items ON audit.dedicated_item = items.id OR audit.dedicated_item = NULL;"
    con.query(sql, null, (err, result) => {
        if (err) throw err;
        res.json(result)
    })
})


module.exports = router;