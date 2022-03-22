
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
//const { chatService } = require('./chat');
const { userErrorOptions } = require('../utils/errormessages');
const { formatService } = require('./format.js');
const { makeId } = require('../utils/randomstring');
class UserService {

  constructor() {}

  login = async function(loginUser) {
    const user = await Users.findOne({email: loginUser._email});
    console.log('login user => ', user);
    if(!user) return new Error(userErrorOptions.LOGIN);
    const response = await bcrypt.compare(loginUser._password, user.password);
    console.log('login response => ', response);
    if(!response) return new Error(userErrorOptions.LOGIN);
    const currentUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
    };
    const accessToken = jwt.sign(currentUser,
      process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'
    });
    const expirationTime = 60*60;
    return {email: currentUser.email, id: currentUser.id , token: accessToken, expiresIn: expirationTime};
  }

  get = async function(id) {
    try{
      const user = await Users.findOne({ id });
      console.log('then user ,id-> ', !user, id);
      if (!user)
        return new Error(userErrorOptions.NOTFOUND);
      return formatService.getUserFormat(user);
    }catch(err) {
      throw err;
    }
  }

  getChats =  async function(id) {
    try {
      const user = await Users.findOne({id})
      .populate('chats')
      .exec();
      const chats = await formatService.responseChatFormat(user?.chats? user.chats: []);
      return chats;
    } catch (err) {
      console.error('user get chats err => ', err);
      throw new Error(err);
    }
  }

  save = async function (newUserInfo) {
    try {
      console.log('save user => ', newUserInfo);
      const hash = await bcrypt.hash(newUserInfo._password,10);
      const user = await Users.findOne({$and: [{ email: {$eq: newUserInfo._email}},{password: {$eq: hash}}]});
      if (user)
        throw new Error(userErrorOptions.ALLREADYEXISTS);
      const newUser = new Users({
        id: makeId(15),
        name: newUserInfo._firstName,
        phone: newUserInfo._phone,
        email: newUserInfo._email,
        chats: [],
        img: null,
        socketId: null,
        password: hash,
      });
      return newUser.save();
    }catch(err) {
      console.error('user save err => ', err);
      throw err;
    }
  }

  update = async function (newUserInfo) {
    //console.log('update -> updatedUser ', updatedUser);
    try {
      const user = await Users.findOne({ id: newUserInfo.id });
      if (!user) throw new Error(userErrorOptions.NOTFOUND);
      user.id = newUserInfo.id;
      user.name =  newUserInfo.name;
      user.phone =  newUserInfo.phone;
      user.email =  newUserInfo.email;
      user.password = newUserInfo.password? newUserInfo.password: user.password,
      user.chats = newUserInfo.chats? [... newUserInfo.chats]: [...user.chats];
      user.socketId = newUserInfo.socketId? newUserInfo.socketId : user.socketId;
      console.log('newUserInfo.img => ', newUserInfo.img.filename);
      if (newUserInfo.img && Object.keys(newUserInfo.img).includes('filename') && newUserInfo.img.filename) {
        //const imageFile = fs.readFileSync(path.join('.','public','images',`${newUserInfo.img.name}`));
        const imageFile = fs.readFileSync(path.join('./public/images/' + `${newUserInfo.img.filename}`));
        user.img = {
          data: imageFile,
          contentType: 'image/*',
          filename: newUserInfo.img.filename,
        }
      }
      user.save();
      return await this.get(user.id);
    }catch(err) {
      console.log('user update err => ', err);
      throw err;
    }
  }

  find = async function(params) {
   try{
    return await Users.find(params).exec()
   }catch(err) {
     console.log('find function err => ', err);
     throw err;
   }
  }

  async getAll() {
    try{
      return await Users.find({});
    } catch(err) {
      console.error('user getAll err => ', err);
      throw err;
    }
  }

}

module.exports = {
  userService: new UserService()
};

