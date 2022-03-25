const express = require('express');
const { userService } = require('../services/user');
const { AuthenticationToken } = require('../middleware/jwt');
const { upload } = require('../middleware/processimg');
const router = express.Router();

router.post('/login', Login);

router.post('/register', saveUser);

router.put('/', upload.single('image') ,updateUserInfo)

//router.post('/update', updateUserInfo);

router.get('/allUsers', getAllUsers);

router.get('/chats/:id', AuthenticationToken, getChatByuserId);

router.get('/:id', AuthenticationToken, getUserById);



module.exports = router;


function Login(req,res,next) {
  const {isUser} = req.body;
  userService.login(isUser)
  .then(authUser => {
    res.status(200).json(authUser);
  })
  .catch(err => {
    res.status(500).json(new Error(err))
  })
}

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

  const {newUser } = req.body;
  userService.save(newUser)
  .then(savedUser => {
    res.status(200).json(savedUser);
  })
  .catch(err => {
    res.status(400).json(new Error(err));
  })
}

function updateUserInfo(req,res,next) {
 const { id, name, phone, password, email, image } = req.body;
 const img = req.file;
 userService.update({id, name, phone, password, email,img})
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
    else
      res.status(200).json(chatsData);
  })
  .catch(err => {
    res.status(505).json(err);
  })
 }
