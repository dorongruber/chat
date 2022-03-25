const { msgService } = require('../services/message');
const { chatService } = require('../services/chat');
const { userService } = require('../services/user');
const Chats = require('../models/Chats');
const { ObjectId } = require('bson');
const { formatService } = require('./format.js');
const io = require('../config/socketio').getIO();
class SocketServerService {
  feildToPopulate = 'users';
  constructor() {}

  async EnterToPool(userId,userName,chatId,chatName,socket) {
    try{
      const checkUser = await chatService.getUserInPool(chatName,userId);
      if(!checkUser) {
        socket.join(chatName);
        const user = await userService.get(userId);
        const isAdded = chatService.addUserToPool(user._id)
        if (!user) throw false;
        return true;
      } else if (checkUser.socketId !== socket.id) {
        socket.join(chatName);
        const user = await userService.get(userId);
        user.socketId = socket.id;
        const updatedUser = await userService.update(user);
        if (!updatedUser) throw false;
        return true;
      }
    }catch(err) {
      throw err;
    }
  }

  CreateChat(chatId, chatName, chatUsers,userId,socket) {

    chatUsers.forEach(u => {
      const connectedUser = userService.get(u._id);
      if(connectedUser) {
        io.to(connectedUser.socketId).emit('JoinChat',({chatName,chatId}));
      }
    });
  }
  //todo check if nedd to change function
  async ConnectToChat(newuser, socket) {
    try {
      const {userId, userName, chatId } = {...newuser};
      let user = chatService.getSingleChatUserById(chatId,userId);
      if (!user) {
        const savedUser = chatService.addUserToChat(user);
      }
      socket.join(chatId);
      const chatUsers = await chatService.getSingalePopulatedField(chatId, this.feildToPopulate);
      io.in(chatId).emit('inChat', (chatUsers));
    }catch(err) {
      throw err;
    }
  }

  async SendMessage(userId, chatId, message, socket,date,userName) {
    try {
      const msgId = `${userId}${chatId}${date}`;
      const msgState = await msgService.save(message,msgId,userId,chatId,chatId,date,userName);
      const chatState = await chatService.addMessageToChat(msgState)
      const newMesg = formatService.messageFormat(msgState,userName);

      this.sendMessageToUsersNotConnectedToSocket(chatId,newMesg);
      socket.to(chatId).emit('newMessage', (newMesg));

    }catch(err) {
      throw err;
    }
  }

  async sendMessageToUsersNotConnectedToSocket(chatId,newMesg) {
    let chatUsers = await chatService.getSingalePopulatedField(chatId, this.feildToPopulate);
    chatUsers.forEach(async (u) => {
      io.to(u.socketId).emit('newMessageToChatMenu', (newMesg));
    });
  }



}

module.exports = {
  SocketServerService: new SocketServerService()
};
