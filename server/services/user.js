const Users = require('../models/Users');

const { chatService } = require('./chat');

class UserService {

  constructor() {}

  get = function(id) {
    try{
      return Users.findOne({id})
      .then(user => {
        console.log('then user ,id-> ', !user,id);
        if (!user) return new Error('404');
        return this.getUserFormat(user);
      });
    }catch(err) {
      throw err;
    }
  }

  getChats =  async function(id) {
    try {
      const user = await Users.findOne({id})
      .populate('chats')
      .exec();
      const chats = await chatService.responseChatFormat(user.chats);
      return chats;
    } catch (err) {
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
      throw err;
    }
  }

  update = async function (newUserInfo) {
    try {
      const user = await Users.findOne({ id: newUserInfo.id });
      if (!user) throw new Error('404');
      user.id = newUserInfo.id;
      user.name =  newUserInfo.name;
      user.phone =  newUserInfo.phone;
      user.email =  newUserInfo.email;
      user.password =  newUserInfo.password,
      user.chats = [... newUserInfo.chats];
      user.socketId = newUserInfo.socketId;
      return user.save();
    }catch(err) {
      throw err;
    }
  }

  async getAll() {
    try{
      return await Users.find({});
    } catch(err) {
      throw err;
    }
  }

  async responseUsersFormat(users) {
    const formatedUsers = [];
    for(i =0; i< users.length; i++) {
      formatedUsers.push(this.getUserFormat(users[i]));
    }
    return formatedUsers;
  }

  getUserFormat(user) {
    return {
      _id: user._id,
      id: user.id,
      name: user.name,
      phone: user.phone,
      password: user.password,
      email: user.email,
      chats: user.chats,
      socketId: user.socketId,
    };
  }

}

module.exports = {
  userService: new UserService()
};

