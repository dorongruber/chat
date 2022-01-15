const fs = require('fs');
const path = require('path');

const Chats = require('../models/Chats');
const Users = require('../models/Users');
const { userService } = require('../services/user');
const { formatService } = require('./format.js');


class ChatService {
  constructor() {}

  getById = async function(id) {
    const chat = await Chats.findOne({id});
    if (!chat) return new Error('404');
    return chat;
  }

  getByName = async function(chatName) {
    return Chats.findOne({name: chatName});
  }

  createChat = async function(newChatInfo) {
   try{
    console.log('create chat chat service newChatInfo ==> ', newChatInfo.id, newChatInfo.name, JSON.parse(newChatInfo.users));

    const chat = await Chats.findOne({id: newChatInfo.id});
    let image = null;
    if (chat) return res.status(200).end();
    if (newChatInfo.img && Object.keys(newChatInfo.img).includes('filename') && newChatInfo.img.filename) {
      //const imageFile = fs.readFileSync(path.join('.','public','images',`${newChatInfo.img.name}`));
      const imageFile = fs.readFileSync(path.join('./public/images/' + `${newChatInfo.img.filename}`));
      image = {
        data: imageFile,
        contentType: 'image/*',
        filename: newChatInfo.img.filename,
      }
    }
    const params = {id: {$in : [...newChatInfo.users]}};
    const users = await Users.find({id: {$in: [...JSON.parse(newChatInfo.users)]}}).exec();

    //const ids = await userService.find(params);
    //console.log('ids - >', newChatInfo.img.filename, users.map(u => u._id));
    const newChat = new Chats({
      id: newChatInfo.id,
      name: newChatInfo.name,
      users: [...users.map(u => u._id)],
      img: image,
    });

    // newChatInfo.users.forEach(uid => {

    // })
    for(const user of users) {
      // userService.get(uid)
      // .then(user => {
      //   if(!user) return;
      //   user.chats.push(new ObjectId(newChat._id));
      //   userService.update(user);
      // })

        user.chats.push(newChat._id);
        await userService.update(user);
    }
    const saved = await newChat.save(function(err,chat) {
      if(err) throw err;
      console.log('saved chat -> ', chat._id);
      return chat;
    });
    return saved;
   } catch(err) {
     console.error('create chat err => ', err);
     throw err;
   }
  }

  getSingalePopulatedField = async function(id, fieldToPopulate) {
    try {
      const chat = await Chats.findOne({id})
      .populate({
        path: fieldToPopulate
      })
      if (fieldToPopulate === 'messages') {
        return chat.messages;
      } else {
        return chat.users;
      }
    }catch(err) {
      throw new Error(err);
    }
  }

  getSingleChatUserById = async function(chatId,userId) {
    const FeildToPopulate = 'users';
    const chatUsers = await this.getSingalePopulatedField(chatId, FeildToPopulate);
    return await chatUsers.find(u => u.id === userId);
  }

  getSingleChatMessages = async function(chatId) {
    const FeildToPopulate = 'messages';
    let chatMsgs = await this.getSingalePopulatedField(chatId, FeildToPopulate);
    //const lastDayMsgs;
    chatMsgs = this.getMessagesFromLastDate(chatMsgs);
    const formatedMessages = formatService.requestMsgFormat(chatMsgs);
    return formatedMessages;
  }

  getUserInPool = async function(chatName,userId) {
    try {
      const chat = await Chats.findOne({name: chatName})
      .populate({
        path: 'users',
        match: {id: {$eq: userId}}
      })
      .exec();
      //console.log('getUserInPool user => ', chat.users);
      const user = chat.users[0];
      return user;
    }catch(err) {
      throw err;
    }
  }

  addUserToPool = async function(id) {
    try{
      const pool = await this.getByName('generalPool');
      pool.users.push({_id: id});
      const updatedPool = pool.save();
      if (!updatedPool) return false;
      return true;
    } catch(err) {
      throw err;
    }
  }

  updateUserInPool(userId) {
    try {
      this.populaueUsersInPollChat();
        this.poolChat.users.findOne({id: userId});
    }catch(err) {
      throw err;
    }
  }

  async removeUserFromChat(chatId,userId) {
    try{
      return Chats.findOne({id: chatId})
      .populate('users')
      .exec(function(err,chat) {
        if(err) return err;
        const user = chat.users.find(u => u.id === userId);
        chat.users = chat.users.filter(u => u.id !== userId);
        //console.log('chat.users after => ', chat.users, userId);
        Users.findOne({id: userId}).populate('chats')
        .exec((err, user) => {
          if (err) return err;
          user.chats = user.chats.filter(c => c.id !== chatId);
          //console.log('user chats after -> ', user.chats, chatId);
          user.save();
        })
        if (chat.users.length < 1)
        return this.deleteChat(chatId);
      return chat.save();
      })

    }catch(err) {
      console.log('err =>!!!!!', err);
      throw err
    }
  }

  async getPrevDayMsgs(id,date) {
    const FeildToPopulate = 'messages';
    let chatMsgs = await this.getSingalePopulatedField(id, FeildToPopulate);
    const refDate = new Date(date);
    const lastMsgDate = {
      day: refDate.getUTCDate(),
      month: refDate.getUTCMonth(),
      year: refDate.getUTCFullYear()
    }
    console.log('lastMsgDate -> ', refDate.getUTCDate());
    const index = chatMsgs.findIndex(m => this.checkDate(lastMsgDate,m.date));
    console.log('index -> ', index);
    if (index !== -1 && index !== 0) {
      chatMsgs = chatMsgs.slice(0, index -1);
      chatMsgs = this.getMessagesFromLastDate(chatMsgs);
      const formatedMessages = formatService.requestMsgFormat(chatMsgs);
      return formatedMessages;
    }
    return null;
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

  async addUserToChat(userState) {
    try{
      const chat = await Chats({id: userState.chatId});
      if (!chat) throw new Error('chat not found');
      chat.users.push(userState);
      return chat.save();
    }catch(err) {
      throw err;
    }
  }



  populaueUsersInPollChat() {
    this.poolChat.populate('users')
    .exec();
  }

  async getChat(filter) {
    try{
      const chat = await Chats.findOne(filter);
      return chat
    }catch(err) {
      throw err;
    }
  }

  getMessagesFromLastDate(chatMsgs) {
    console.log('chatMsgs => ', chatMsgs);
    if(!chatMsgs || !chatMsgs.length) return [];
    const lastMsgDate = {
      day: chatMsgs[chatMsgs.length -1].date.getUTCDate(),
      month: chatMsgs[chatMsgs.length -1].date.getUTCMonth(),
      year: chatMsgs[chatMsgs.length -1].date.getUTCFullYear()
    }
    console.log('chatMsgs => ',lastMsgDate);
    return chatMsgs.filter(m => this.checkDate(lastMsgDate, m.date));

  }

  checkDate(date, msgDate) {
    if (
      date.day === msgDate.getUTCDate() &&
      date.month === msgDate.getUTCMonth() &&
      date.year === msgDate.getUTCFullYear()
      )
      return true;
    return false;
  }

  deleteChat(id) {
    return Chats.findOneAndDelete({id}, (err,chat) => {
      if(err) throw new Error(err);
      return true;
    });
  }

}

module.exports = {
  chatService: new ChatService()
};
