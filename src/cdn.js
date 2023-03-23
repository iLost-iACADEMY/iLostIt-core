const express = require('express')
const router = express.Router()

const fs = require("fs");
const path = require("path");
const url = require("url");

router.get('/image', (req, res) => {
    const readStream = fs.createReadStream('./cdn/' + req.query.img, { encoding: 'base64' });
    var chunked;

    fs.readFile('./cdn/' + req.query.img, function (err, data) {
        if (err) throw err 
        res.writeHead(200, { 'Content-Type': 'image/jpeg' })
        res.end(data)
    })
})

module.exports = router