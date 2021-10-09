const express = require('express');
const {userService} = require('../services/user');
const { AuthenticationToken } = require('../middleware/jwt');
const path = require('path');

const router = express.Router();

router.post('')

router.get('/:id', async (req,res) => {
  const { id } = req.params;
  const user = await userService.get(id);
  console.log('router user -> ', user);

  res.json({
    id: user.id,
    name: user.name,
    phone: user.phone,
    password: user.password,
    email: user.email
  });
})

module.exports = router;
