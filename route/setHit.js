const express = require('express');
const setHit = module.exports = {};
const router = express.Router();
const mysql2 = require('mysql2');
const connection = mysql2.createPool({
    host: process.env.MYSQL2_HOST,
    user: process.env.MYSQL2_USER,
    password: process.env.MYSQL2_PW,
    database: process.env.MYSQL2_DB
});

setHit.updateHit = async (req) => {
    const date = await getCustomDate();
    if (req.body.ip !== '211.215.156.98' && req.body.ip !== '39.7.58.158') {
        console.log(req.body)
        connection.query('UPDATE story SET hits=hits+1 WHERE idx = ?', [req.body.id], (err, result, fields) => {
            if (err) console.log(err);
        })
    }
}
// setHit.createHit = (id)=>{
//     connection.query('INSERT INTO hit(storyId) VALUES(?)',[id],(err,result,fields)=>{
//         if(err)console.log(err);
//     })
// }
function getCustomDate() {
    return new Promise((resolve, reject) => {
        let date = new Date().toLocaleString('ko-kr');
        date = date.replace('.', '년');
        date = date.replace('.', '월');
        date = date.replace('.', '일');
        date = date.replace(':', '시 ');
        date = date.replace(':', '분 ');
        date = date.substring(0, date.indexOf('시') + 1)
        resolve(date);
    })
}
