const express = require('express');

const { chatService } = require('../services/chat');
const router = express.Router();

router.get('/messages/:id', getMessagesByChatId);

router.get('/:id', getChatById);


module.exports = router;

function getChatById(req,res,next) {
  const { id } = req.params;
  chatService.getById(id)
  .then(chat => {
    res.status(201).json(chat);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

function getMessagesByChatId(req,res,next) {
  const { id } = req.params;
  chatService.getChatMessages(id)
  .then(messages => {
    res.status(200).json(messages);
  })
  .catch(err => {
    res.status(404).json(err);
  });
}

function getChatUserByChatId(req,res,next) {

}

function addUser(req,res,next) {

}

function deleteUserById(req,res,next) {}
