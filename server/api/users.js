const express = require('express');
const { userService } = require('../services/user');
const { AuthenticationToken } = require('../middleware/jwt');
const path = require('path');

const router = express.Router();

router.post('/save', saveUser);

router.post('/update', updateUserInfo);

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
}
