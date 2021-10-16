const Users = require('../models/Users');
class userService {

  constructor() {}

  get = function(id) {
    try{
      return Users.findOne({id})
      .then(user => {
        console.log('then user ,id-> ', !user,id);
        if (!user) return new Error('404');
        return this.getUserFormat(user);
      });
    }catch(err) {
      throw err;
    }
  }

  update = async function (newUserInfo) {
    try {
      const user = await Users.findOne({ id: newUserInfo.id });
      if (!user)
        throw new Error('404');
      user = {
        id: newUserInfo.id,
        name: newUserInfo.name,
        phone: newUserInfo.phone,
        email: newUserInfo.email,
        password: newUserInfo.password,
      };
      return user.save();
    }catch(err) {
      throw err;
    }
  }

  responseUsersFormat = function(users) {
    const formatedUsers = [];
    for(i =0; i< users.length; i++) {
      formatedUsers.push(this.getUserFormat(users[i]));
    }
    return formatedUsers;
  }

  getUserFormat(user) {
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      password: user.password,
      email: user.email
    };
  }

}

module.exports = {
  userService: new userService()
};

