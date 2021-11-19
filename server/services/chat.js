const Chats = require('../models/Chats');
const { msgService } = require('../services/message');
const { userService } = require('./user');
class ChatService {

  constructor() {}

  getById = async function(id) {
    const chat = await Chats.findOne({id});
    if (!chat) return new Error('404');
    return chat;
  }

  createChat = async function(id,name,users) {
    const chat = await Chats.findOne({id});
    if (chat) return res.status(200).end();
    const newChat = new Chats({
      id,
      name,
      users: [users.map(u => u._id)]
    });
    const saved = await newChat.save();
    return saved;
  }

  getChatMessages = async function(id) {
    try {
      const chat = await Chats.findOne({id})
      .populate('messages')
      .exec()
      const formatedMessages = msgService.requestMsgFormat(chat.messages);
      return formatedMessages;
    }catch(err) {
      throw err;
    }
  }

  getChatUsers = function(id) {
    try {
      return Chats.findOne({id})
      .populate('users')
      .exec((err,chat) => {
        if (err) throw err;
        const formatedUsers = userService.responseUsersFormat(chat.users);
        return formatedUsers;
      })
    }catch(err) {
      throw err;
    }
  }

  ////////////////////// inner functions

  async addMessageToChat(msgState) {
    try{
      const chat = await Chats.findOne({id: msgState.Cid});
      if (!chat) throw new Error('chat not found');
      chat.messages.push(msgState);
      return chat.save();
    }catch(err) {
      throw err;
    }
  }

  async addUserToChat(userState) {
    try{
      const chat = await Chats({id: userState.chatId});
      if (!chat) throw new Error('chat not found');
      chat.users.push(userState);
      return chat.save();
    }catch(err) {
      throw err;
    }
  }

}

module.exports = {
  chatService: new ChatService()
};
