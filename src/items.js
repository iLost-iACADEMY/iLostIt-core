const express = require('express')
const router = express.Router()
const mysqlconndet = require('./mysql.json')
const mysql = require('mysql2')
const multer = require('multer')

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

    var sql = "SELECT items.id, item_name, lost_since, image, status, accounts.username FROM `items` JOIN `accounts` ON items.foundlost_by = accounts.id;";

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
                        if (!(results[0].permission <= 3)) {
                            const query = 'SELECT items.id, item_name, lost_since, image, status, accounts.username FROM `items` JOIN `accounts` ON items.foundlost_by = accounts.id LEFT JOIN `founded` ON items.id = founded.item WHERE items.status = "approved" AND founded.id is NULL';
                            con.query(query, [], (error, results, fields) => {
                                if (error) throw error;
                                res.json(results)
                            })
                        } else {
                            res.json(result) // User Has Permission
                        }
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

router.get('/item', (req, res) => {
    con.connect()

    var sql = "SELECT * FROM items JOIN accounts ON items.foundlost_by = accounts.id WHERE items.id = ?";
    con.query(sql, [req.query.itemid], function (err, result) {
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
                        const query = 'SELECT * FROM founded WHERE item = ?'
                        con.query(query, [req.query.itemid], function (err, resdatafound) {
                            // User Has Permission
                            if (resdatafound.length > 0) {
                                res.json({ ...result[0], permissionLevel: results[0].permission, founded: {founded: 1, ...resdatafound[0]} })
                            } else {
                                res.json({ ...result[0], permissionLevel: results[0].permission, founded: {founded: 0} })
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
        } catch (e) {
            res.status(403).json({
                "status": "error",
                "message": "Forbidden"
            })
        }
    })
})

function makegenfoldimg(length) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let genfoldimg = makegenfoldimg(10)

function uploadinit() {
    genfoldimg = makegenfoldimg(10)
    var upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "./cdn");
            },
            filename: (req, file, cb) => {
                cb(null, genfoldimg)
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }
    });

    return upload.single('image')
}

router.post('/add', uploadinit(), (req, res) => {
    con.connect()

    try {
        session = req.headers['authorization']
        sessionBearer = session.split(' ');
        sessionBearerToken = sessionBearer[1];

        const query = 'SELECT * FROM sessions JOIN accounts ON sessions.userkey = accounts.id WHERE token = ?';
        con.query(query, [sessionBearerToken], (error, results, fields) => {

            var sql = "INSERT INTO `items` (item_name, image, foundlost_by, status) VALUES (?, ?, ?, ?)";
            con.query(sql, [req.body.item_name, genfoldimg, results[0].userkey, "pending"], function (err, result) {
                if (err) throw err;
                genfoldimg = makegenfoldimg(10)
                res.json({
                    "id": result.insertId,
                    "status": "success",
                    "message": "Added Successfully!"
                })
            })
        })
    } catch (e) {
        res.status(403).json({
            "status": "error",
            "message": "Forbidden"
        })
    }
})

router.post('/approve', (req, res) => {
    con.connect()

    var sql = "SELECT items.id, item_name, lost_since, image, status, accounts.username FROM `items` JOIN `accounts` ON items.foundlost_by = accounts.id;";

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
                        if (results[0].permission <= 3) {
                            var sql = "UPDATE items SET status = 'approved' WHERE id = ?";
                            con.query(sql, [req.body.itemid], function (err, result) {
                                if (err) throw err;
                                res.json({
                                    "status": "success",
                                    "message": "Approved Successfully!"
                                })
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

router.delete('/delete', (req, res) => {
    var sql = "SELECT * FROM items JOIN accounts ON items.foundlost_by = accounts.id WHERE items.id = ?";
    con.query(sql, [req.body.itemid], function (err, result) {
        if (err) throw err;

        try {
            session = req.headers['authorization']
            sessionBearer = session.split(' ');
            sessionBearerToken = sessionBearer[1];

            const query = 'SELECT * FROM sessions JOIN accounts ON sessions.userkey = accounts.id WHERE token = ?';
            con.query(query, [sessionBearerToken], (error, results, fields) => {
                if (error) throw error;
                if (results.length > 0) {
                    if (sessionBearerToken == results[0].token && results[0].permission <= 4 && (results[0].userkey == result[0].foundlost_by || results[0].permission <= 3)) {
                        var sql = "DELETE FROM items WHERE id = ?";
                        con.query(sql, [req.body.itemid], function (err, result) {
                            if (err) throw err;
                            res.json({
                                "status": "success",
                                "message": "Deleted Successfully!"
                            })
                        })
                    } else {
                        res.status(403).json({
                            "status": "error",
                            "message": "Invalid token or Unauthorized"
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

router.post('/report', (req, res) => {
    var sql = "SELECT * FROM items JOIN accounts ON items.foundlost_by = accounts.id WHERE items.id = ?";
    con.query(sql, [req.query.itemid], function (err, result) {
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
                        const query = "INSERT INTO `report` (reason, item) VALUES (?, ?)";
                        con.query(query, [req.body.reason, req.body.itemid], (error, results, fields) => {
                            if (error) throw error;
                            res.json({
                                "status": "success",
                                "message": "Reported Successfully!"
                            })
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
        } catch (e) {
            res.status(403).json({
                "status": "error",
                "message": "Forbidden"
            })
        }
    })
})

router.get('/me', (req, res) => {
    con.connect()

    var sql = "SELECT items.id, item_name, lost_since, image, status, accounts.username FROM `items` JOIN `accounts` ON items.foundlost_by = accounts.id;";

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
                        const query = 'SELECT items.id, item_name, lost_since, image, status, accounts.username FROM `items` JOIN `accounts` ON items.foundlost_by = accounts.id WHERE items.foundlost_by = ?';
                        con.query(query, [results[0].userkey], (error, results, fields) => {
                            if (error) throw error;
                            res.json(results)
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
        } catch (e) {
            res.status(403).json({
                "status": "error",
                "message": "Forbidden"
            })
        }
    })

})

module.exports = router