

const { newUser, getUser, removeUser, updateUser, getChatUsers } = require('../socketio/utils/users');
const { msgService } = require('../services/message');
const { chatService } = require('../services/chat');
class SocketServerService {

  constructor() {}

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
      let io = require('../config/socketio').getIO();
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
