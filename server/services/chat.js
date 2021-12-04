const Chats = require('../models/Chats');
const { userService } = require('./user');
const { msgService } = require('./message');


class ChatService {
  constructor() {
    //this.poolChat = this.getByName('generalPool');
  }

  getById = async function(id) {
    const chat = await Chats.findOne({id});
    if (!chat) return new Error('404');
    return chat;
  }

  getByName = async function(chatName) {
    return Chats.findOne({name: chatName});
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

  getChatUsers = async function(id) {
    try {
      const chat = await Chats.findOne({id})
      .populate('users')
      .exec();
      // console.log('chat.users => ', userService);
      // const formatedUsers = await userService.responseUsersFormat(chat.users);
      return chat.users;
    }catch(err) {
      throw err;
    }
  }

  getSingleChatUserById = async function(chatId,userId) {
    const chatUsers = await this.getChatUsers(chatId);
    return await chatUsers.find(u => u.id === userId);
  }

  getUserInPool = async function(chatName,userId) {
    try {
      const chat = await Chats.findOne({name: chatName})
      .populate('users')
      .exec();
      console.log('chat.users => ', chat);
      // const formatedUsers = await userService.responseUsersFormat(chat.users);
      // return formatedUsers;
      const user = await chat.users.find(u => u.id === userId);
      return user;
    }catch(err) {
      throw err;
    }
  }

  addUserToPool = async function(id) {
    try{
      const pool = await this.getByName('generalPool');
      pool.users.push({_id: id});
      const updatedPool = pool.save();
      if (!updatedPool) return false;
      return true;
    } catch(err) {
      throw err;
    }
  }

  updateUserInPool(userId) {
    try {
      this.populaueUsersInPollChat();
        this.poolChat.users.findOne({id: userId});
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

  async responseChatFormat(chats) {
    const formatedChats = [];
    chats.forEach(chat => {
      formatedChats.push({
        id: chat.id,
        name: chat.name
      })
    });
    return formatedChats;
  }

  populaueUsersInPollChat() {
    this.poolChat.populate('users')
    .exec();
  }

}

module.exports = {
  chatService: new ChatService()
};
