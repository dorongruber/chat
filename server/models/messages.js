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

// MessageSchema.methods.get = async (id) => {
//   try {
//     const message = await this.find({ id });
//     if (!message)
//       return;
//     return message;
//   } catch (err) {
//     throw err;
//   }
// }

// MessageSchema.methods.delete = (id) => {
//   return this.delete({id: id})
//   .then(message => {
//     if (!message) return false;
//     return true;
//   })
//   .catch(err => {
//     throw err;
//   });
// }

module.exports = mongoose.model('Messages', MessageSchema);
