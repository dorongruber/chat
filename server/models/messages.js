const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  Fid: {
    type: String,
    required: true,
  },
  Fname: {
    type: String,
    required: true,
  },
  Tid: {
    type: String,
    required: true,
  },
  Cid: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  messageState: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model('Messages', MessageSchema);
