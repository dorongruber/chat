const express = require('express');

const { chatService } = require('../services/chat');
const { upload } = require('../middleware/processimg');
const router = express.Router();

router.get('/messages/:id', getMessagesByChatId);

router.get('/prevDateMsgs/:id/:date', getPrevDayMsgs)

router.post('/newchat', upload.single('image') , addChat)

router.get('/:id', getChatById);

router.delete('/:chatId/:userId', deleteUserById);

module.exports = router;

function addChat(req,res,next) {
  console.log('addChat body => ', req.body.id, req.body.name);
  const {id,name,users} = req.body;
  const img = req.file;
  chatService.createChat({id,name,users,img})
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
  chatService.getSingleChatMessages(id)
  .then(messages => {
    res.status(200).json(messages);
  })
  .catch(err => {
    console.log('err ->', err);
    res.status(404).json(err);
  });
}

function getPrevDayMsgs(req,res,next) {
  const {id,date} = req.params;
  chatService.getPrevDayMsgs(id,date)
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

