
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

    socket.on('file1Event', function () {
      console.log('file1Event triggered');
    });

    socket.on('connectToChat',  (newUser) => {
      try {
        SocketServerService.ConnectToChat(newUser,socket);
      }catch(err) {
        throw err;
      }
    })

    socket.on('sendMessage', (msgObg) => {
      //todo save mesage in db
      const {userId, chatId, message, date,userName} = msgObg;
      //console.log('socket send message --> ',userId, chatId, message, date,userName);
      SocketServerService.SendMessage(userId, chatId, message,socket,date,userName);
    })

  });
}
