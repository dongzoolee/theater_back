const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

app.set('port', 2500);
const writeRouter = require('./route/write');
const readRouter = require('./route/read');
const reportRouter = require('./route/report');
const getInfoRouter = require('./route/getInfo');
const socketio = require('socket.io');

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
// 신고하기 router
app.use('/api/report', reportRouter);
// 각종 정보 가져오는 router
app.use('/api/getinfo', getInfoRouter);

const server = app.listen(app.get('port'), () => {
    console.log('server has started on port ' + app.get('port'))
})
// 소켓 라우터
const io = socketio();
io.attach(server);
io.on('connection', (socket) => {
    socket.on('comment-cng',()=>{
        io.emit('update-comment');
    })
})
app.set('socketio', io);
// https://stackoverflow.com/questions/47249009/nodejs-socket-io-in-a-router-page