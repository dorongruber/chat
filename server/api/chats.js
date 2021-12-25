const express = require('express');

const { chatService } = require('../services/chat');
const router = express.Router();

router.get('/messages/:id', getMessagesByChatId);

router.post('/newchat', addChat)

router.get('/:id', getChatById);

router.delete('/:chatId/:userId', deleteUserById);

module.exports = router;

function addChat(req,res,next) {
  const {id,name,users} = req.body;
  chatService.createChat(id,name)
  .then(newChat => {
    res.status(200).json(newChat);
  })
  .catch(err => {
    res.status(401).json(err);
  })
}

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
  const feildToPopulate = 'messages';
  chatService.getChatMessages(id, feildToPopulate)
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

function deleteUserById(req,res,next) {
  const { chatId,userId } = req.params;
  chatService.removeUserFromChat(chatId,userId)
  .then(deletedUser => {
    res.status(200).json(deletedUser);
  })
  .catch(err => {
    res.status(500).json(err);
  })
}

