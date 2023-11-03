
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const { userErrorOptions } = require('../utils/errormessages');
const { formatService } = require('./format.js');
const { makeId } = require('../utils/randomstring');
const { Api404Error } = require('../utils/error_handlling/custom_error_handlers')
class UserService {

  constructor() {}

  login = async function(loginUser) {
    try{
      const user = await this.getUserByEmailAndPassword(loginUser._email, loginUser._password);
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
    } catch(err) {
      throw err;
    }
  }

  save = async function (newUserInfo) {
    try {
      const user = await this.getUserByEmailAndPassword(newUserInfo._email,newUserInfo._password);
      if (user)
        throw new Error(userErrorOptions.ALLREADYEXISTS);
      const hash = await bcrypt.hash(newUserInfo._password,10);
      const newUser = this.SerializeUser(newUserInfo,hash);
      return newUser.save();
    }catch(err) {
      throw err;
    }
  }

  update = async function (newUserInfo) {
    try {
      const user = await Users.findOne({ id: newUserInfo.id });
      if (!user) throw new Error(userErrorOptions.NOTFOUND);
      user.id = newUserInfo.id;
      user.name =  newUserInfo.name;
      user.phone =  newUserInfo.phone;
      user.email =  newUserInfo.email;
      user.chats = newUserInfo.chats? [...newUserInfo.chats]: [...user.chats];
      user.socketId = newUserInfo.socketId? newUserInfo.socketId : user.socketId;
      if (newUserInfo.img && Object.keys(newUserInfo.img).includes('filename') && newUserInfo.img.filename) {
        const imageFile = fs.readFileSync(path.join('./public/images/' + `${newUserInfo.img.filename}`));
        user.img = {
          data: imageFile,
          contentType: 'image/*',
          filename: newUserInfo.img.filename,
        }
      }
      user.save();
      return formatService.getUserFormat(user);
    }catch(err) {
      throw err;
    }
  }

  SerializeUser = function(newUserInfo,hash) {
    return new Users({
      id: makeId(15),
      name: newUserInfo._firstName,
      phone: newUserInfo._phone,
      email: newUserInfo._email,
      chats: [],
      img: null,
      socketId: null,
      password: hash,
    });
  }

  async getAll() {
    try{
      return await Users.find({});
    } catch(err) {
      throw err;
    }
  }
  
  getByCustomId = async function(id) {
    try{
      const docs = await Users.aggregate().match({id: id});
      const user = docs[0];
      if (!user)
        return new Error(userErrorOptions.NOTFOUND);
      return formatService.getUserFormat(user);
    }catch(err) {
      throw err;
    }
  }

  getUserByEmailAndPassword = async function(email, password) {
    const docs = await Users.aggregate().match({email: email});
    const user = docs[0];
    if(!user) throw new Api404Error(userErrorOptions.LOGIN);
    const response = await bcrypt.compare(password, user.password);
    if(!response) throw new Api404Error(userErrorOptions.LOGIN);
    return user;
  }

  getChats =  async function(id) {
    try {
      const user = await Users.findOne({id})
      .lean()
      .populate('chats');
      const chats = await formatService.responseChatFormat(user?.chats? user.chats: []);
      return chats;
    } catch (err) {
      throw new Error(err);
    }
  }

}

module.exports = {
  userService: new UserService()
};

