const Messages = require("../models/messages");

class FormatService {
  constructor() {}

  async responseChatFormat(chats) {
    const formatedChats = [];
    for (const chat of chats) {
      const asMsgs = chat.messages && chat.messages.length;
      let lmId;
      if(asMsgs)
        lmId = chat.messages[chat.messages.length -1];
      const lastMsg = asMsgs? [await Messages.findOne({_id: lmId})] : null;
      formatedChats.push({
        id: chat.id,
        name: chat.name,
        lastMsg:  lastMsg ? this.requestMsgFormat(lastMsg)[0] : lastMsg,
        img: {
          contentType: chat?.img && chat?.img.contentType ? chat.img.contentType : null,
          data: {
            data: chat?.img && chat?.img.data ? chat.img.data.toString('base64') : null,
            type: chat?.img && chat?.img.data && chat?.img.data.type ? chat.img.data.type : null,
          },
          filename: chat?.img? chat.img.filename : null,
        }
      })
    }
    return formatedChats;
  }

  async singleChatResponseFormat(chat) {
    const singleChatFormat = {
      id: chat.id,
      name: chat.name,
      users: chat.users,
      messages: chat.messages,
      img: {
        contentType: chat?.img && chat?.img.contentType ? chat.img.contentType : null,
        data: chat?.img && chat?.img.data ? chat.img.data.toString('base64') : null,
        filename: chat?.img? chat.img.filename : null,
      }
    }
    return singleChatFormat;
  }

  async responseUsersFormat(users) {
    const formatedUsers = [];
    for(i =0; i< users.length; i++) {
      formatedUsers.push(this.getUserFormat(users[i]));
    }
    return formatedUsers;
  }

  getUserFormat(user) {
    return {
      _id: user._id,
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      chats: user.chats,
      socketId: user.socketId,
      img: {
        data: user?.img && user?.img.data ? user.img.data.toString('base64') : null,
        filename: user?.img && user?.img.filename ? user.img.filename : null,
      }
    };
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

  messageFormat(msgState,userName) {
    const msg = {
     message: msgState.message,
     userId: msgState.Fid,
     chatId: msgState.Cid,
     userName: msgState.Fname,
     date: msgState.date
   };
   return msg;
 }
}

module.exports.formatService = new FormatService();
