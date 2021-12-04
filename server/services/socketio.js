

const { newUser, getUser, removeUser, updateUser, getChatUsers, getSingleChatUserByIds } = require('../socketio/utils/users');
const { msgService } = require('../services/message');
const { chatService } = require('../services/chat');
const { userService } = require('../services/user');
const Chats = require('../models/Chats');
const { ObjectId } = require('bson');
const io = require('../config/socketio').getIO();
class SocketServerService {

  constructor() {}

  async EnterToPool(userId,userName,chatId,chatName,socket) {
    try{
      const checkUser = await chatService.getUserInPool(chatName,userId);
      if(!checkUser) {
        socket.join(chatName);
        const user = await userService.get(userId);
        console.log('get user => ', user);
        const isAdded = chatService.addUserToPool(user._id)
        if (!user) throw false;
        console.log('pool');
        return true;
      } else if (checkUser.socketId !== socket.id) {
        socket.join(chatName);
        const user = await userService.get(userId);
        user.socketId = socket.id;
        const updatedUser = await userService.update(user);
        console.log('updateed user -> ', updatedUser);
        if (!updatedUser) throw false;
        return true;
      }
    }catch(err) {
      throw err;
    }
  }
//new ObjectId(u._id)
  CreateChat(chatId, chatName, chatUsers,userId,socket) {
    const user = userService.get(userId);
    //console.log('chatusers -> ', chatUsers);
    const users = chatUsers.map(u => {
      return userService.get(u.id);
    })
    const ids = chatUsers.map(u => {
      const user = userService.get(u._id);
      return new ObjectId(parseInt(user._id));
    });
    const newChat = new Chats({
      id: chatId,
      name: chatName,
      messages: [],
      users: [...ids],
    });

    newChat.save(function(err) {
      if (err) throw new Error(err);
      //socket.join(chatId);
      chatUsers.forEach(u => {
        userService.get(u._id)
        .then(user => {
          if(!user) return;
          user.chats.push(new ObjectId(newChat._id));
          userService.update(user);
          // const connectedUser = userService.get(u._id);
          // newUser(connectedUser.userId, connectedUser.userName,chatId, connectedUser.socketId);
        })
      })
    });
    chatUsers.forEach(u => {
      const connectedUser = userService.get(u._id);
      if(connectedUser) {
        //console.log('connectedUser -> ', connectedUser,chatName,chatId);
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
      const chatUsers = await chatService.getChatUsers(chatId);
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
      const newMesg = this.messageFormat(msgState,userName);

      this.sendMessageToUsersNotConnectedToSocket(userId,chatId,newMesg);
      socket.to(chatId).emit('newMessage', (newMesg));
    }catch(err) {
      throw err;
    }
  }

  async sendMessageToUsersNotConnectedToSocket(userId,chatId,newMesg) {
    let chatUsers = await chatService.getChatUsers(chatId);
    //console.log('chatUsers =>!!!!!!!!!!!!!!! ', chatUsers,userId);
    chatUsers = chatUsers.filter(u => u.id !== userId);
    chatUsers.forEach(async (u) => {
      const socketUser = await userService.get(u.id);
      //console.log('socketUser => ',socketUser);
      io.to(socketUser.socketId).emit('newMessageToChatMenu', (newMesg));
    });
  }

  messageFormat(msgState,userName) {
     const msg = {
      message: msgState.message,
      userId: msgState.Fid,
      chatId: msgState.Cid,
      userName: userName,
      date: msgState.date
    };
    return msg;
  }

}

module.exports = {
  SocketServerService: new SocketServerService()
};
