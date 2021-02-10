const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');
const connection = mysql2.createPool({
    host: process.env.MYSQL2_HOST,
    user: process.env.MYSQL2_USER,
    password: process.env.MYSQL2_PW,
    database: process.env.MYSQL2_DB
});

router.use('/nextstoryidx', (req, res) => {
    connection.query(`SELECT idx FROM story ORDER BY idx DESC LIMIT 1`, (err, result, fields) => {
        res.json({ idx: result[0].idx + 1 })
    })
})

module.exports = router;
