const express = require('express');
const {userService} = require('../services/user');
const { AuthenticationToken } = require('../middleware/jwt');
const path = require('path');

const router = express.Router();

router.post('')

router.get('/:id', userService.get)

module.exports = router;
