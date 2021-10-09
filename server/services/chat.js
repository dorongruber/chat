const Chats = require('../models/Chats');
const { msgService } = require('../services/message');
class ChatService {

  constructor() {}

  getById = async function(req,res,next) {
    const { id } = req.params;
    const chat = await Chats.findOne({id});
    if (!chat) return res.status(404).end();
    return res.status(201).json(chat);
  }

  createChat = async function(req,res,next) {
    const { id, name } = req.params;
    const chat = await Chats.findOne({id});
    if (chat) return res.status(200).end();
    const newChat = new Chats({
      id,
      name
    });
    const saved = await newChat.save();
    return saved;
  }

  getChatMessages = async function(req,res,next) {
    try {
      const { id } = req.params;
      return Chats.findOne({id})
      .populate('messages')
      .exec((err, chat) => {
        if (err) return res.status(400).jeson(err);
        const formatedMessages = msgService.requestMsgFormat(chat.messages);
        return res.status(200).json(formatedMessages);
      })
    }catch(err) {
      throw err;
    }
  }

  ////////////////////// inner functions

  async addMessageToChat(msgState) {
    try{
      const chat = await Chats.findOne({id: msgState.Cid});
      if (!chat) throw new Error('chat not found');
      chat.messages.push(msgState);
      return chat.save();
    }catch(err) {
      throw err;
    }
  }



}

module.exports = {
  chatService: new ChatService()
};
