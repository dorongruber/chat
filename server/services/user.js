const Users = require('../models/Users');
class userService {

  constructor() {}

  // get(id, cb) {
  //   try{
  //     return Users.findOne({id})
  //     .then(user => {
  //       console.log('then user ,id-> ', user,id);
  //       if (!user) return 404;
  //       return user;
  //     });
  //   }catch(err) {
  //     throw err;
  //   }
  // }

  get = function(req,res,next) {
    try{
      const { id } = req.params;
      return Users.findOne({id})
      .then(user => {
        console.log('then user ,id-> ', user,id);
        if (!user) return res.status(404).end();
        return res.json({
              id: user.id,
              name: user.name,
              phone: user.phone,
              password: user.password,
              email: user.email
          });
      });
    }catch(err) {
      throw err;
    }
  }

}

module.exports = {
  userService: new userService()
};

