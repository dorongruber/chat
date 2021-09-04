const { newUser, getUser, removeUser, updateUser } = require('./utils/users');

exports = module.exports = function(io){
  io.on('connection', function (socket)
  {
    socket.on('file1Event', function () {
      console.log('file1Event triggered');
    });

    socket.on('connectToChat', ({userId,userName,ChatId}) => {
      let user = getUser(userId);
      if (!user) {
        console.log('new user');
        user = newUser(userId,userName,ChatId)
        socket.join(chatId);
      }
      socket,emit('inChat', ({userId,userName,ChatId}));
    })

    socket.on('sendMessage', ({userId, chatId, message}) => {
      //todo save mesage in db

      socket.to(chatId).emit('newMessage', ({userId, message}));
    })

  });
}
