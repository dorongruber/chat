const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const http = require('http');
const app = express();

app.use(express.json());
const server = http.createServer(app);
const io = socketIO(server);
const chatSocket = require('./server/socketio/socketio')(io)




const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('listening at port ' + PORT));
