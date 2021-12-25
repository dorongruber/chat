const Chats = require('../models/Chats');
const { msgService } = require('./message');
const Users = require('../models/Users');

class ChatService {
  constructor() {}

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

  getSingalePopulatedField = async function(id, fieldToPopulate) {
    try {
      const chat = await Chats.findOne({id})
      .populate({
        path: fieldToPopulate
      })
      if (fieldToPopulate === 'messages') {
        const formatedMessages = msgService.requestMsgFormat(chat.messages);
        return formatedMessages;
      } else {
        return chat.users;
      }
    }catch(err) {
      throw new Error(err);
    }
  }

  getSingleChatUserById = async function(chatId,userId) {
    const FeildToPopulate = 'users';
    const chatUsers = await this.getSingalePopulatedField(chatId, FeildToPopulate);
    return await chatUsers.find(u => u.id === userId);
  }

  getUserInPool = async function(chatName,userId) {
    try {
      const chat = await Chats.findOne({name: chatName})
      .populate({
        path: 'users',
        match: {id: {$eq: userId}}
      })
      .exec();
      //console.log('getUserInPool user => ', chat.users);
      const user = chat.users[0];
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
    const formatedChats = [];
    for (const chat of chats) {
      await this.getChatMessages(chat.id).then(msgs => {
        formatedChats.push({
          id: chat.id,
          name: chat.name,
          lastMsg: msgs && msgs.length? msgs[msgs.length -1] : null,
        })
      })
    }
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
