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
  chatType: {
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
  }],
  img: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('Chats', ChatSchema);
