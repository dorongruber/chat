const express = require('express');

const {chatService} = require('../services/chat');
const router = express.Router();

router.get('/:id', (req,res,next) => {
  const { id } = req.params;
  const requestedChat = await chatService.getById(id);
  res.json(requestedChat);
})
