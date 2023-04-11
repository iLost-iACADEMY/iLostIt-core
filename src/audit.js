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

module.exports.AddAudit = function AddAudit(action, actby, desc, deditem) {
    const sql = "INSERT INTO `audit` (`action`, `act_by`, `description`, `dedicated_item`) VALUES (?, ?, ?, ?);"
}


module.exports = router;