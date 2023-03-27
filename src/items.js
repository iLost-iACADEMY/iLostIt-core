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

    var sql = "SELECT items.id, item_name, lost_since, image, accounts.username FROM `items` JOIN `accounts` ON items.foundlost_by = accounts.id;";

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
                        res.json(result[0]) // User Has Permission
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

const genfoldimg = makegenfoldimg(10)

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

router.post('/add', upload.single('image'), (req, res) => {
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

module.exports = router