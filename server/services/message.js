const Messages = require('../models/messages');

class MessageService {

  constructor() {}

  async get(id,cb) {
    try {
      const message = await Messages.findOne({id});
      if (!message) throw 404;
      return this.responseMsgFormat(message);
    }catch(err) {
      throw err;
    }
  }

  async save(msg,id,fid,tid,cid,date,fname) {
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
        date,
        Fname: fname,
      });
      console.log('new message -> ', newMsg);
      const saveState = await newMsg.save();
      return saveState;
    }catch(err) {
      throw err;
    }
  }

  requestMsgFormat(msgs) {
    const formatedMsgs = [];
    for(let i=0; i< msgs.length; i++) {
      formatedMsgs.push(this.responseMsgFormat(msgs[i]));
    }
    return formatedMsgs;
  }

  responseMsgFormat(msg) {
    return {
      userName: msg.Fname,
      chatId: msg.Cid,
      date: msg.date,
      userId: msg.Fid,
      message: msg.message,
    }
  }
}

module.exports = {
  msgService: new MessageService()
};
