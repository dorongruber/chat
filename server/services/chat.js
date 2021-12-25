const Chats = require('../models/Chats');
const { msgService } = require('./message');
const { ObjectId } = require('mongodb');
const Users = require('../models/Users');


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
      //console.log('chat.users => ', chat);
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

  async removeUserFromChat(chatId,userId) {
    try{
      const chat = Chats.findOne({id: chatId})
      .populate('users')
      .exec(function(err,chat) {
        if(err) return err;
        const user = chat.users.find(u => u.id === userId);
        chat.users = chat.users.filter(u => u.id !== userId);
        //console.log('chat.users after => ', chat.users, userId);
        Users.findOne({id: userId}).populate('chats')
        .exec((err, user) => {
          if (err) return err;
          user.chats = user.chats.filter(c => c.id !== chatId);
          //console.log('user chats after -> ', user.chats, chatId);
          user.save();
        })
      })
      if (chat.users.length < 1)
        return this.deleteChat(chatId);
      return chat.save();
    }catch(err) {
      console.log('err =>!!!!!', err);
      throw err
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
    let lastMsg;
    const formatedChats = [];
    for (const chat of chats) {
      await this.getChatMessages(chat.id).then(msgs => {
        if(msgs && msgs.length) {
          const index = msgs.length -1;
          lastMsg = msgs[index];
        } else {
          lastMsg = null;
        }
        formatedChats.push({
          id: chat.id,
          name: chat.name,
          lastMsg: lastMsg,
        })
      })
    }
    // for (const chat of chats) {
    //   Chats.findOne({ id: chat.id })
    //     .populate('messages')
    //     .exec((err, chat) => {
    //       if (err)
    //         throw err;
    //       if (chat.messages && chat.messages.length) {
    //         const index = chat.messages.length - 1;
    //         console.log('index => ', chat.messages[index]);
    //         lastMsg = chat.messages[index];
    //       }
    //       else {
    //         lastMsg = null;
    //       }
    //       formatedChats.push({
    //         id: chat.id,
    //         name: chat.name,
    //         lastMsg: lastMsg,
    //       });
    //     })

    // }
    return formatedChats;
  }

  populaueUsersInPollChat() {
    this.poolChat.populate('users')
    .exec();
  }

  async getChat(filter) {
    try{
      const chat = await Chats.findOne(filter);
      return chat
    }catch(err) {
      throw err;
    }
  }

  deleteChat(id) {
    return Chats.findOneAndDelete({id}, (err,chat) => {
      if(err) throw new Error(err);
      return true;
    });
  }

}

module.exports = {
  chatService: new ChatService()
};
