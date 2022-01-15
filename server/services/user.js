
const fs = require('fs');
const path = require('path');

const Users = require('../models/Users');
//const { chatService } = require('./chat');
const { formatService } = require('./format.js');

class UserService {

  constructor() {}

  get = async function(id) {
    try{
      const user = await Users.findOne({ id });
      console.log('then user ,id-> ', !user, id);
      if (!user)
        return new Error('404');
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
      const chats = await formatService.responseChatFormat(user.chats);
      return chats;
    } catch (err) {
      console.error('user get chat serr => ', err);
      throw new Error(err);
    }
  }

  save = async function (id,name,phone,email,password) {
    try {
      const user = await Users.find({ id });
      if (user)
        throw new Error('404');
      const newUser = new Users({
        id,
        name,
        phone,
        email,
        password,
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
      if (!user) throw new Error('404');
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

