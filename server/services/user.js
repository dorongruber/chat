const Users = require('../models/Users');
class userService {

  constructor() {}

  get(id, cb) {
    try{
      return Users.findOne({id})
      .then(user => {
        console.log('then user ,id-> ', user,id);
        if (!user) return 404;
        return user;
      });
    }catch(err) {
      throw err;
    }
  }

}

module.exports = {
  userService: new userService()
};

