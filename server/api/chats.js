const express = require('express');

const {chatService} = require('../services/chat');
const router = express.Router();

router.get('/messages/:id', chatService.getChatMessages);

router.get('/:id', chatService.getById);


module.exports = router;
