const express = require('express');
const { userService } = require('../services/user');
const { AuthenticationToken } = require('../middleware/jwt');
const path = require('path');

const router = express.Router();

router.post('/save', saveUser);

router.put('/',updateUserInfo)

//router.post('/update', updateUserInfo);

router.get('/allUsers', getAllUsers);

router.get('/chats/:id', getChatByuserId);

router.get('/:id', getUserById);



module.exports = router;




function getUserById(req,res,next) {
  const { id } = req.params;
  userService.get(id)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    console.log(err)
    res.status(401).json(new Error(err));
  });
}

function saveUser(req,res,next) {
  const { id , name, phone, email , password } = req.body;
  userService.save(id,name,phone,email,password)
  .then(savedUser => {
    res.status(200).json(savedUser);
  })
  .catch(err => {
    res.status(400).json(new Error(err));
  })
}

function updateUserInfo(req,res,next) {
 console.log('updateUserInfo -> ', req.body);
 userService.update(req.body)
 .then(updatedUser => {
   res.status(200).json(updatedUser);
 })
 .catch(err => {
   res.status(400).json(err);
 })
}

function getAllUsers(req,res,next) {
  userService.getAll()
  .then(users => {
    //console.log('server all user -> ', users);
    res.status(200).json(users);
  })
  .catch(err => {
    res.status(401).json(err);
  })
}

function getChatByuserId(req,res,next) {
  const { id } = req.params;
  userService.getChats(id)
  .then(chatsData => {
    if(!chatsData || chatsData.length === 0)
      res.status(404).json('Not Found');
    res.status(200).json(chatsData);
  })
  .catch(err => {
    res.status(505).json(err);
  })
 }
