const express = require('express')
const router = express.Router()
const mysqlconndet = require('./mysql.json')
const mysql = require('mysql2')
var bcrypt = require('bcryptjs');
const crypto = require('crypto');

var con = mysql.createConnection({
    host: mysqlconndet.serverhost,
    user: mysqlconndet.username,
    password: mysqlconndet.password,
    database: mysqlconndet.database,
    port: mysqlconndet.port,
    connectTimeout: 0
});

function AddAudit(action, actby, desc, deditem) {
    const sql = "INSERT INTO `audit` (`action`, `act_by`, `description`, `dedicated_item`) VALUES (?, ?, ?, ?);"
    con.query(sql, [action, actby, desc, deditem])
}

router.get('/', (req, res) => {
    con.connect()

    var sql = "";

    res.json({
        "status": "success",
    })
})

router.get('/me', (req, res) => {
    con.connect()

    function decrypt(key, data) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    }

    const token = req.query.token;
    const query = 'SELECT * FROM sessions WHERE token = ?';
    con.query(query, [token], (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            const decrypted = decrypt("ilost", token);
            const split = decrypted.split('+');
            const username = split[0];
            const permission = split[1];
            const sha = split[2];

            if (sha == results[0].sha) {
                res.json({
                    "status": "success",
                    "username": username,
                    "permission": permission,
                    "userid": results[0].userkey
                })
            } else {
                res.json({
                    "status": "error",
                    "message": "Invalid token"
                })
            }
        } else {
            res.json({
                "status": "error",
                "message": "Invalid token"
            })
        }
    })
})

router.post('/login', (req, res) => {
    con.connect()

    function encrypt(key, data) {
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var crypted = cipher.update(data, 'utf-8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
    }

    function decrypt(key, data) {
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    }

    function makesha(length) {
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const { username, password } = req.body
    const query = 'SELECT * FROM accounts WHERE username = ?';
    con.query(query, [username], (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
            if (bcrypt.compareSync(password, results[0].password)) {
                const query = 'INSERT INTO sessions (userkey, token, sha) VALUES(?, ?, ?)';
                const shad = makesha(5);
                const token =  encrypt("ilost", results[0].username + '+' + results[0].permission + '+' + shad);

                con.query(query, [results[0].id, token, shad], (error, results1, fields) => {
                    if (error) throw error;
                    res.json({
                        "status": "success",
                        "message": "Logged in!",
                        "permission": results[0].permission,
                        "username": results[0].username,
                        "token": token,
                        "shad": shad
                    })
                })
            } else {
                res.status(403).json({
                    "status": "error",
                    "message": "Wrong password!"
                })
            }
        } else {
            res.status(403).json({
                "status": "error",
                "message": "User doesn't exist!"
            })
        }
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
            const query = "SELECT * FROM accounts WHERE id = ?"
            con.query(query, [results.insertId], (err, resultuser) => {
                AddAudit("New Account", resultuser[0].id, resultuser[0].username, null)
                res.json("Registered! Welcome to iLost");
            }) 
        })
    } else {
        res.status(403).json("Password doesn't match")
    }
})

module.exports = router