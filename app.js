const express = require('express');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const userRouter = require('./server/api/users');
const chatRouter = require('./server/api/chats');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/user',userRouter);
app.use('/api/chat', chatRouter);

module.exports = app;
