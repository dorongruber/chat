const Messages = require('../models/messages');
const { formatService } = require('./format.js');

class MessageService {

  constructor() {}

  async get(id,cb) {
    try {
      const message = await Messages.findOne({id});
      if (!message) throw 404;
      return formatService.responseMsgFormat(message);
    }catch(err) {
      throw err;
    }
  }

  async getByObjectId(_id) {
    try {
      const message = await Messages.findOne({_id: _id});
      if (!message) throw 404;
      return formatService.responseMsgFormat(message);
    }catch(err) {
      throw err;
    }
  }

  async save(msg,id,fid,tid,cid,date,fname) {
    try {
      const checkMsg = await Messages.findOne({id});
      if (checkMsg) return null;
      const newMsg = new Messages({
        id,
        Fid: fid,
        Tid: tid,
        Cid: cid,
        message: msg,
        date,
        Fname: fname,
      });
      const saveState = await newMsg.save();
      return saveState;
    }catch(err) {
      throw err;
    }
  }

}

module.exports = {
  msgService: new MessageService()
};
