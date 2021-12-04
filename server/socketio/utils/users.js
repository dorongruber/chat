const users = [];

module.exports.newUser = function newUser(userId,userName,chatId,socketId) {
    try {
      if (!userId || !userName) throw 'user Info is invalide';
      const newuser = {userId,userName,chatId, socketId};
      users.push(newuser);
      return newuser;
    }catch(err) {
      throw err;
    }
}

module.exports.updateUser = function updateUser(userId,userName,chatId,socketId) {
  try {
    const index = users.find(u => u.userId === userId && u.chatId === chatId);
    if (index !== -1) {
      users[index] = {
        userId,
        userName,
        chatId,
        socketId
      }
      return  users[index];
    }
      return null;
  }catch(err) {
    throw new Error(err);
  }
}

module.exports.getUser = function getUser(id) {
  try {
    console.log('utills users => ', users);
    const index = users.findIndex(u => u.userId === id);
    if (index === -1){
      return null;
    }
    return users[index];
  } catch(err) {
    throw new Error(err);
  }
}

module.exports.getSingleChatUserByIds = function getSingleChatUserByIds(cid,uid) {
  try {
    const index = users.findIndex(u => u.chatId === cid && u.userId === uid);
    if (index === -1){
      return null;
    }
    return users[index];
  } catch(err) {
    throw new Error(err);
  }
}

module.exports.removeUser = function removeUser(id) {
  try{
    if (!id) throw 'id value is undefined'
    users = users.filter(u => u.id !== id);
  }catch(err) {
    throw err;
  }
}

module.exports.getChatUsers = function getChatUsers(chatId) {
  //console.log('getChatUsers(chatId) -> ', users.filter(u => u.chatId == chatId), users, chatId);
  return users.filter(u => u.chatId == chatId);
}

module.exports.addUsersToChat = function addUsersToChat() {

}
