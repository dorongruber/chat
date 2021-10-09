const mongoose = require('mongoose');
const ChatSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Messages',
  }],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  }]
});

ChatSchema.methods.getChatUsers = function() {
  return this.populate('Users')
  .catch(err => {
    throw err;
  });
}

ChatSchema.methods.removeUser = function(id) {
  console.log('remove user');
}

module.exports = mongoose.model('Chats', ChatSchema);
