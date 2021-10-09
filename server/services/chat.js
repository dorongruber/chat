const Chats = require('../models/Chats');

class ChatService {

  constructor() {}

  async getById(id) {
    const chat = await Chats.findOne({id});
    if (!chat) throw new Error('404');
    return chat;
  }
}

module.exports = {
  chatService: new ChatService()
};
