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
  },
  img: {
    data: Buffer,
    contentType: String,
    filename: {
      type: String,
    },
  }
});

module.exports = mongoose.model('Users', UserSchema);
