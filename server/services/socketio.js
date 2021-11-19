

const { newUser, getUser, removeUser, updateUser, getChatUsers } = require('../socketio/utils/users');
const { msgService } = require('../services/message');
const { chatService } = require('../services/chat');
const { userService } = require('../services/user');
const Chats = require('../models/Chats');
const Users = require('../models/Users');
const io = require('../config/socketio').getIO();
class SocketServerService {

  constructor() {}

  EnterToPool(userId,userName,chatId,chatName,socket) {
    try{
      const checkUser = getUser(userId);
      if(!checkUser) {
        socket.join(chatName);
        const user = newUser(userId,userName,chatId,socket.id);
        if (!user) throw false;
        console.log('pool');
        return true;
      }
    }catch(err) {
      throw err;
    }
  }

  CreateChat(chatId, chatName, chatUsers,userId,socket) {
    const user = userService.get(userId);
    const ids = chatUsers.map(u => u._id);
    const newChat = new Chats({
      id: chatId,
      name: chatName,
      messages: [],
      users: [...ids],
    });

    newChat.save(function(err) {
      if (err) throw new Error(err);
      socket.join(chatId);
    });
    const users = this.getUsers(chatId);
    users.forEach(u => {
      io.to(u.socket.id).emit('JoinChat',({chatName,chatId}));
    });

  }

  async ConnectToChat(newuser, socket) {
    try {
      const {userId, userName, chatId } = {...newuser};
      let user = getUser(userId);
      if (!user) {
        const savedUser = newUser(userId,userName,chatId,socket.id);
        console.log('connetct to chat -> ', savedUser);
        socket.join(savedUser.chatId);
      }
      const chatUsers = await this.getUsers(chatId);

      io.in(chatId).emit('inChat', (chatUsers));

    }catch(err) {
      throw err;
    }
  }

  async SendMessage(userId, chatId, message, socket,date,userName) {
    try {
      console.log('socket service -> ',userId, chatId, message,date,userName);
      const msgId = `${userId}${chatId}${date}`;
      const msgState = await msgService.save(message,msgId,userId,chatId,chatId,date,userName);
      const chatState = await chatService.addMessageToChat(msgState)
      const newMesg = {
        message: msgState.message,
        userId: msgState.Fid,
        chatId: msgState.Cid,
        userName: userName,
        date: msgState.date
      };
      socket.to(chatId).emit('newMessage', (newMesg));
    }catch(err) {
      throw err;
    }
  }

  getUsers(chatId) {
    return Promise.resolve(getChatUsers(chatId));
  }

}

module.exports = {
  SocketServerService: new SocketServerService()
};
