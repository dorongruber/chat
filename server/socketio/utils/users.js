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

module.exports.updateUser = function updateUser(id,newPassword, newName) {
  try {
    const index = users.indexOf(id);
    if (index !== -1)
      users[index] = {
        id,
        password: newPassword,
        name: newName
      }
  }catch(err) {
    throw new Error(err);
  }
}

module.exports.getUser = function getUser(id) {
  try {
    const index = users.findIndex(u => u.userId === id);
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
