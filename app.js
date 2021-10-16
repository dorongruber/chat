const express = require('express');
const path = require('path');
const cors = require('cors');
//const http = require('http');
require('dotenv').config();

const userRouter = require('./server/api/users');
const chatRouter = require('./server/api/chats');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/user',userRouter);
app.use('/api/chat', chatRouter);
// const server = http.createServer(app);

// const io = require('./server/config/socketio').init(server);
// // init socketio
// require('./server/api/socketio')(io);
// //init mongodb
// require('./server/config/mongodb');

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => console.log('listening at port ' + PORT));
module.exports = app;
