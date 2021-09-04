const users = [];

module.exports = function newUser(userId,userName,ChatId) {
    try {
      if (!userId || !userName) throw 'user Info is invalide';
      const newuser = {userId,userName,ChatId};
      users.push(newuser);
      return newUser;
    }catch(err) {
      throw err;
    }
}

module.exports = function updateUser(id,newPassword, newName) {
  const index = users.indexOf(id);
  if (index !== -1)
    users[index] = {
      id,
      password: newPassword,
      name: newName
    }
}

module.exports = function getUser(id) {
  return users.filter(u => u.id === id);
}

module.exports = function removeUser(id) {
  try{
    if (!id) throw 'id value is undefined'
    users = users.filter(u => u.id !== id);
  }catch(err) {
    throw err;
  }
}
