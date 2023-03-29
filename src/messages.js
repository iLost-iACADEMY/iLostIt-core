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

router.get('/list', (req, res) => {
    con.connect()

    session = req.headers['authorization']
    sessionBearer = session.split(' ');
    sessionBearerToken = sessionBearer[1];

    const query = 'SELECT * FROM sessions JOIN accounts ON sessions.userkey = accounts.id WHERE token = ?';
    con.query(query, [sessionBearerToken], (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            if (sessionBearerToken == results[0].token && results[0].permission <= 4) {
                // User has Permission
                const query = "SELECT messages.id, since, item, receiver, accounts.username, items.item_name, items.image FROM messages JOIN accounts ON messages.receiver = accounts.id OR messages.sender = accounts.id JOIN items ON messages.item = items.id WHERE sender = ? OR receiver = ?"
                con.query(query, [results[0].userkey, results[0].userkey], async (error, results1, fields) => {
                    if (error) throw error;
                    if (results1.length > 0) {
                        var arrayput = []

                        let hasId = function(arr, id){
                            return arr.some(e => e.item === id);
                        };

                        await results1.forEach(element => {
                            if (element.username != results[0].username && element.receiver == results[0].userkey) {
                                if (hasId(arrayput, element.item)) {
                                    arrayput.splice(arrayput.findIndex(item => item.item === element.item), 1)
                                }
                                arrayput.push(element)
                            }
                        });
                        await res.json(arrayput)
                    } else {
                        await res.status(403).json({
                            "status": "error",
                            "message": "Forbidden"
                        })
                    }
                })
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
})

module.exports = router