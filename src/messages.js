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
                const query = "SELECT messages.id, since, item, receiver, accounts.username, accounts.id as accid, items.item_name, items.image FROM messages JOIN accounts ON messages.receiver = accounts.id OR messages.sender = accounts.id JOIN items ON messages.item = items.id WHERE sender = ? OR receiver = ?"
                con.query(query, [results[0].userkey, results[0].userkey], async (error, results1, fields) => {
                    if (error) throw error;
                    if (results1.length > 0) {
                        var arrayput = []

                        let hasId = function (arr, id) {
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

router.get('/messages', (req, res) => {
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
                const query = "SELECT messages.id, message, since, item, receiver, sender, accounts.username, items.item_name, items.image, accounts.id AS userid FROM messages JOIN accounts ON messages.receiver = accounts.id OR messages.sender = accounts.id JOIN items ON messages.item = items.id WHERE item = ? AND (sender = ? OR receiver = ?)"
                con.query(query, [req.query.itemid, results[0].userkey, results[0].userkey], async (error, results1, fields) => {
                    if (error) throw error;
                    if (results1.length > 0) {
                        var arrayput = []

                        let hasId = function (arr, id) {
                            return arr.some(e => e.userid === id);
                        };

                        await results1.forEach(element => {
                            
                            if (hasId(arrayput, element.userid)) {
                                //arrayput.splice(arrayput.findIndex(item => item.userid === element.sender), 1)
                                //arrayput.splice(arrayput.findIndex(item => item.userid === element.receiver), 1)
                                arrayput.splice(arrayput.findIndex(item => item.userid !== element.userid), 1)
                            }
                            arrayput.push(element)
                           
                        });
                        arrayput.splice(-1, 1);
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