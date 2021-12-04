const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chats',
  }],
  socketId: {
    type: String,
    required: false,
  }
});

// UserSchema.methods.GetUser = async function(id) {
//   try {
//     const user = await this.findOne({ id });
//     if (!user) return;
//     return user;
//   } catch (err) {
//     throw err;
//   }
// }

// UserSchema.methods.SaveUser = async function(id,name,password) {
//   const user = await this.find({ id });
//   if (user)
//     return;
//   const nweUser = new UserSchema({ id: id, name: name, password: password });
//   return nweUser.save((err) => {
//     throw new Error('saving failed');
//   });
// }
// // set first arg as id
// UserSchema.methods.UpdateUser = function(args) {
//   this.findOneAndUpdate({id: args[0]}, {...args})
//   .then(state => {
//     console.log('is user updated -> ', state);
//   })
//   .catch(err => {
//     throw err;
//   })
// }

// UserSchema.methods.DeleteUser = function(id) {
//   return this.delete({id})
//   .then(user => {
//     if (!user) return false;
//     return true;
//   }).catch(err => {
//     throw err;
//   });
// }

module.exports = mongoose.model('Users', UserSchema);
