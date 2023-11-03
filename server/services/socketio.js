const { msgService } = require('../services/message');
const { chatService } = require('../services/chat');
const { userService } = require('../services/user');
const { formatService } = require('./format.js');
const io = require('../config/socketio').getIO();
class SocketServerService {
  feildToPopulate = 'users';
  constructor() {}

  async EnterToPool(userId,userName,chatId,chatName,socket) {
    try{
      const checkUser = await chatService.getUserInPool(chatName,userId);
      const user = await userService.getByCustomId(userId);
      if(!checkUser) {
        socket.join(chatName);
        const isAdded = chatService.addUserToPool(user._id)
        if (!user) throw false;
        return true;
      } else if (checkUser.socketId !== socket.id) {
        socket.join(chatName);
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

    chatUsers.forEach((u) => {
      userService.getByCustomId(u._id).then(user => {
        io.to(user.socketId).emit('JoinChat',({chatName,chatId}));
      })
    });
  }
  //todo check if nedd to change function
  async ConnectToChat(newuser, socket) {
    try {
      const {userId, userName, chatId } = {...newuser};
      let user = userService.getByCustomId(userId);
      if (!user) {
        const savedUser = chatService.addUserToChat(user);
      }
      socket.join(chatId);
    }catch(err) {
      throw err;
    }
  }

  async SendMessage(userId, chatId, message, socket,date,userName) {
    try {
      const msgId = `${userId}${chatId}${date}`;
      const msgState = await msgService.save(message,msgId,userId,chatId,chatId,date,userName);
      chatService.addMessageToChat(msgState)
      const newMesg = formatService.messageFormat(msgState);

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
