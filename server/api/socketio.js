
const  SocketServerService = require('../services/socketio').SocketServerService;

exports = module.exports = function(io){

  io.on('connection', (socket) =>
  {

    socket.on('createChat' , ({chatId, chatName, chatUsers,userId}) => {
      SocketServerService.CreateChat(chatId, chatName, chatUsers,userId,socket);
    })

    socket.on('EnterPool', ({userId,userName,chatId,chatName}) => {
      SocketServerService.EnterToPool(userId,userName,chatId,chatName,socket);
    })

    socket.on('connectToChat',  (chatId) => {
      try {
        SocketServerService.ConnectToChat(chatId,socket);
      }catch(err) {
        throw err;
      }
    })

    socket.on('sendMessage', (msgObg) => {
      const {userId, chatId, message, date,userName} = msgObg;
      SocketServerService.SendMessage(userId, chatId, message,socket,date,userName);
    })

  });
}
