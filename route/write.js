const express = require('express');
const router = express.Router();
const setHit = require('./setHit');
const updateRss = require('./updateRss');
const mysql2 = require('mysql2');
const connection = mysql2.createPool({
    host: process.env.MYSQL2_HOST,
    user: process.env.MYSQL2_USER,
    password: process.env.MYSQL2_PW,
    database: process.env.MYSQL2_DB
});
router.use('/tmpstory', async (req, res) => {
    const date = await getCustomDate();
    connection.query(`INSERT INTO tmpStory(mainCatIdx, subCatIdx, title, date, location, content)
    VALUES(?, ?, ?, ?, ?, ?)`, [req.body.main, req.body.sub, req.body.title, date, req.body.location, req.body.content], (err, result, fields) => {
        if (err) console.log(err);
        else {
            console.log('tmp save success');
            res.send('');
            // setHit.createHit(result.insertId)
            console.log(result)
            // updateRss.write(req.body, result.insertId)
        };
    })
})
router.use('/story', async (req, res) => {
    const date = await getCustomDate();
    connection.query(`INSERT INTO story(mainCatIdx, subCatIdx, title, date, location, content)
    VALUES(?, ?, ?, ?, ?, ?)`, [req.body.main, req.body.sub, req.body.title, date, req.body.location, req.body.content], (err, result, fields) => {
        if (err) console.log(err);
        else {
            console.log('insertion success');
            res.send('');
            // setHit.createHit(result.insertId)
            console.log(result)
            updateRss.write(req.body, result.insertId)
        };
    })
})
router.use('/anonycomment', async (req, res) => {
    const date = await getCustomDate();

    connection.query(`INSERT INTO comment(storyId, mainWriter, mainDate, mainContent, ip)
    VALUES(?, ?, ?, ?, ?)`, [req.body.storyId, req.body.writer, date, req.body.content, req.body.ip], (err, result, fields) => {
        if (err) console.log(err);
        else { console.log('insertion success'); res.send(''); };

    })
})
router.use('/anonysubcomment', async (req, res) => {
    const date = await getCustomDate();
    console.log(req.body)
    connection.query(`INSERT INTO subComment(storyId, commentId, subWriter, subDate, subContent, ip)
    VALUES(?, ?, ?, ?, ?, ?)`, [req.body.storyId, req.body.targetMainId, req.body.writer, date, req.body.content, req.body.ip], (err, result, fields) => {
        if (err) console.log(err);
        else { console.log('insertion success'); res.send(''); };
    })

})

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
module.exports = router;
