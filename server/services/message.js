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
      formatedMsgs.push({
        userName: msgs[i].Fname,
        chatId: msgs[i].Cid,
        date: msgs[i].date,
        userId: msgs[i].Fid,
        message: msgs[i].message,
      });
    }
    return formatedMsgs;
  }
}

module.exports = {
  msgService: new MessageService()
};
