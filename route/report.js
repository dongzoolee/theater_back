const sendMail = require('../functional/sendMail');
const express = require('express');
const router = express.Router();

router.use('/comment', async (req, res) => {
    await sendMail.main("댓글 신고합니다", req.body.key + "번 댓글을 신고합니다.").catch(console.error)
    res.send('')
})
module.exports = router;
