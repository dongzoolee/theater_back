const express = require('express');
const router = express.Router();
const axios = require('axios');
const setHit = require('./setHit');
const mysql2 = require('mysql2');
const connection = mysql2.createPool({
    host: process.env.MYSQL2_HOST,
    user: process.env.MYSQL2_USER,
    password: process.env.MYSQL2_PW,
    database: process.env.MYSQL2_DB
});

router.use('/story', (req, res) => {
    connection.query(`SELECT * FROM story
    JOIN subCategory
    ON subCategory.mainCatIdx = story.mainCatIdx AND story.idx = ?
    JOIN mainCategory
    ON subCategory.subIdx = story.subCatIdx AND subCategory.mainCatIdx=mainCategory.mainIdx`, [req.body.id], (err, result, fields) => {
        if (err) console.log(err)
        else {
            res.send(result[0])
            setHit.updateHit(req)
        };
    })
})
router.use('/storybymaincategory', (req, res) => {
    connection.query(`
    SELECT subCategory FROM subCategory
    WHERE mainCatIdx = (SELECT mainIdx FROM mainCategory WHERE mainCategory = ?)
    `, [req.body.mainCategory], (err2, result2, fields2) => {
        connection.query(`SELECT COUNT(*) AS cnt FROM story
    WHERE mainCatIdx = (SELECT mainIdx FROM mainCategory WHERE mainCategory = ?)
    `, [req.body.mainCategory], (err1, result1, fields1) => {
            connection.query(`SELECT * FROM story
                WHERE mainCatIdx = (SELECT mainIdx FROM mainCategory WHERE mainCategory = ?)
                ORDER BY date DESC
                LIMIT ?, 4
                `, [req.body.mainCategory, req.body.page ? (req.body.page - 1) * 4 : 0], (err, result, fields) => {
                if (err) console.log(err);
                else res.json({
                    content: result,
                    cnt: result1[0].cnt,
                    subCategory: result2
                })
            })
        })
    })
})
router.use('/categories', (req, res) => {
    if (req.query.data === "sub") {
        connection.query(`SELECT * FROM subCategory 
		JOIN mainCategory
        ON (mainCategory.mainIdx = ? AND mainCategory.mainIdx = subCategory.mainCatIdx)`, [req.query.mainId], (err, result, fields) => {
            if (err) console.log(err);
            else res.json({
                subCategory: result
            })
        });
    } else if (req.query.data === "main") {
        connection.query(`SELECT * FROM mainCategory`, (err1, result1, fields1) => {
            if (err1) console.log(err1)
            else res.json({
                mainCategory: result1
            });
        });
    }
})
router.use('/comment', (req, res) => {
    connection.query(`
        SELECT * FROM comment
        LEFT JOIN subComment
        ON comment.storyId = ? AND subComment.commentId = comment.mainIdx
        WHERE comment.storyId = ?
    `, [req.body.id, req.body.id], (err, result, fields) => {
        connection.query(`
    SELECT (SELECT COUNT(*) FROM comment WHERE storyId = ?) 
     + (SELECT COUNT(*) FROM subComment WHERE storyId = ?) AS cnt 
    `, [req.body.id, req.body.id], (err1, result1, fields1) => {
            res.send({ comment: result, cnt: result1[0].cnt })
        })
    })
})
router.use('/categorycontents', (req, res) => {

    connection.query(`
    SELECT COUNT(*) AS cnt FROM story WHERE 
    mainCatIdx = (SELECT mainIdx FROM mainCategory WHERE mainCategory = ?)
    AND
    subCatIdx = (SELECT subIdx FROM subCategory WHERE subCategory = ?)`, [req.body.mainCategory, req.body.subCategory], (err1, result1, fields1) => {
        connection.query(`SELECT * FROM story WHERE 
        mainCatIdx = (SELECT mainIdx FROM mainCategory WHERE mainCategory = ?)
        AND
        subCatIdx = (SELECT subIdx FROM subCategory WHERE subCategory = ?)
        ORDER BY date DESC
        LIMIT ?, 4`, [req.body.mainCategory, req.body.subCategory, req.body.page ? (req.body.page - 1) * 4 : 0], (err, result, fields) => {
            if (err) console.log(err)
            else {
                res.json({
                    content: result,
                    cnt: result1[0].cnt
                })
            }
        })
    })
})
router.use('/locationcontents', (req, res) => {
    connection.query(`
    SELECT COUNT(*) AS cnt FROM story WHERE 
    location = ?`, [req.body.location], (err1, result1, fields1) => {
        connection.query(`SELECT * FROM story WHERE 
        location = ?
        ORDER BY date DESC
        LIMIT ?, 4`, [req.body.location, req.body.page ? (req.body.page - 1) * 4 : 0], (err, result, fields) => {
            if (err) console.log(err)
            else {
                res.json({
                    content: result,
                    cnt: result1[0].cnt
                })
            }
        })
    })
})
router.use('/distinctlocation', (req, res) => {
    connection.query(`SELECT DISTINCT location FROM story`, (err, result, fields) => {
        if (err) console.log(err)
        else {
            res.send(result)
        }
    })
})
router.use('/searchstory', (req, res) => {
    if (!req.body.subCategory)
        connection.query(`SELECT * FROM story 
        WHERE (title LIKE ?
        OR
        content LIKE ?)
        AND mainCatIdx = (SELECT mainIdx FROM mainCategory WHERE mainCategory = ?)
        ORDER BY date DESC
        LIMIT ?, 4`, ["%" + req.body.search + "%", "%" + req.body.search + "%", req.body.mainCategory, req.body.page ? (req.body.page - 1) * 4 : 0], (err, result, fields) => {
            if (err) console.log(err)
            else res.send(result)
        })
    else
        connection.query(`SELECT * FROM story 
        WHERE (title LIKE ?
        OR
        content LIKE ?)
        AND (mainCatIdx = (SELECT mainIdx FROM mainCategory WHERE mainCategory = ?)
        AND subCatIdx = (SELECT subIdx FROM subCategory WHERE subCategory = ?))
        ORDER BY date DESC
        LIMIT ?, 4`, ["%" + req.body.search + "%", "%" + req.body.search + "%", req.body.mainCategory, req.body.subCategory, req.body.page ? (req.body.page - 1) * 4 : 0], (err, result, fields) => {
            if (err) console.log(err)
            else res.send(result)
        })
})
module.exports = router;
