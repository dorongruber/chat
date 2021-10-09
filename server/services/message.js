const Messages = require('../models/messages');

class MessageService {

  constructor() {}

  async get(id,cb) {
    try {
      const message = await Messages.findOne({id});
      if (!message) return 404;
      return message;
    }catch(err) {
      throw err;
    }
  }

  async save(msg,id,fid,tid,cid,date) {
    console.log('save message -> ', msg,id,fid,tid,cid,date);
    try {
      const checkMsg = await Messages.findOne({id});
      //console.log('asve msg => ', checkMsg);
      if (checkMsg) return null;
      const newMsg = new Messages({
        id,
        Fid: fid,
        Tid: tid,
        Cid: cid,
        message: msg,
        date
      });
      console.log('new message -> ', newMsg);
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
