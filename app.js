const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

app.set('port', 2500);
const writeRouter = require('./route/write');
const readRouter = require('./route/read');
const sethitRouter = require('./route/setHit');
app.use(cors());
// POST 크기 제한 상향
app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({
    limit: "50mb",
    extended: true
}));

// 글 & 댓글 작성 router
app.use('/api/write', writeRouter);
// 글 & 댓글 불러오기 router
app.use('/api/read', readRouter);

const server = app.listen(app.get('port'), () => {
    console.log('server has started on port ' + app.get('port'))
})