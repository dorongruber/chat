const express = require('express');
const {userService} = require('../services/user');
const { AuthenticationToken } = require('../middleware/jwt');
const path = require('path');

const router = express.Router();

router.post('/', updateUserInfo);

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
    res.status(401).json(err);
  });
}

function updateUserInfo(req,res,next) {
 console.log('updateUserInfo -> ', req.body);
}
