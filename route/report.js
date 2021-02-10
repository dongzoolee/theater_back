const sendMail = require('../functional/sendMail');
const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');
const connection = mysql2.createPool({
    host: process.env.MYSQL2_HOST,
    user: process.env.MYSQL2_USER,
    password: process.env.MYSQL2_PW,
    database: process.env.MYSQL2_DB
});

router.use('/comment', async (req, res) => {
    let arr = req.body.key.split('_')
    let idx;
    if (arr.length === 2) {
        connection.query(`update subComment SET subReport=subReport+1 WHERE subIdx = ?`, [arr[1]], (err, result) => {
        })
    } else {
        connection.query(`update comment SET mainReport=mainReport+1 WHERE mainIdx = ?`, [arr[0]], (err, result) => {
        })
    }
    await sendMail.main("댓글 신고합니다", req.body.key + "번 댓글을 신고합니다.").catch(console.error)
    res.send('')
})
module.exports = router;
