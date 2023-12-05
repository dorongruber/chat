const fs = require('fs');
const sharp = require("sharp");
const path = require('path');

const Chats = require('../models/Chats');
const Users = require('../models/Users');
const { userService } = require('../services/user');
const { formatService } = require('./format.js');


class ChatService {
  constructor() {}

  getById = async function(id) {
    const chat = await Chats.aggregate()
    .match({id: id})
    .lookup({
      from: "users",
      localField: "users",
      foreignField: "_id",
      as: "users"
    })
    .lookup({
      from: "messages",
      localField: "messages",
      foreignField: "_id",
      as: "messages"
    })
    .project({
      "id": 1,
      "name": 1,
      "chatType": 1,
      "img": 1,
      "users.id": 1,
      "users.name": 1,
      "users.phone": 1,
      "users.email": 1,
      "users.socketId": 1,
      "users.img": 1,
      "messages": 1,
    });
    if (!chat && chat.length > 0) return new Error('404');
    return formatService.singleChatResponseFormat(chat[0]);
  }

  getByName = async function(chatName) {
    return Chats.findOne({name: chatName});
  }

  createChat = async function(newChatInfo) {
   try{
    const chat = await Chats.findOne({id: newChatInfo.id});
    let image = null;
    if (chat) return this.updateChat(newChatInfo)
    if (newChatInfo.img && Object.keys(newChatInfo.img).includes('originalname') && newChatInfo.img.originalname) {
      image = await this.processImage(newChatInfo.img);
    }
    const users = await Users.find({id: {$in: [...JSON.parse(newChatInfo.users)]}}).exec();
    const newChat = new Chats({
      id: newChatInfo.id,
      name: newChatInfo.name,
      chatType: newChatInfo.type,
      users: [...users.map(u => u._id)],
      img: image,
    });

    for(const user of users) {
        user.chats.push(newChat._id);
        await userService.update(user);
    }
    await newChat.save();
    return formatService.responseNewChatFormat(newChat);
   } catch(err) {
     throw err;
   }
  }

  async updateChat(newChatInfo) {
    try{
      let image;
      const chat = await Chats.findOne({id: newChatInfo.id});
      if (newChatInfo.img && Object.keys(newChatInfo.img).includes('originalname') && newChatInfo.img.originalname) {
        image = await this.processImage(newChatInfo.img);
      }
      const users = await Users.find({id: {$in: [...JSON.parse(newChatInfo.users)]}}).exec();
      chat.name = newChatInfo.name;
      chat.users = [...users.map(u => u._id)];
      chat.img = image;
      for(const user of users) {
          const index = user.chats.findIndex(c => c.equals(chat._id));
          if( index === -1) {
            user.chats.push(chat._id);
            await userService.update(user);
          }
      }
      const saved = await chat.save();
      return saved;
    }catch(err) {
      throw new Error(err)
    }
  }

  getSingalePopulatedField = async function(id, fieldToPopulate) {
    try {
      const chat = await Chats.aggregate()
      .match({id: id})
      .lookup({
        from: fieldToPopulate,
        localField: fieldToPopulate,
        foreignField: "_id",
        pipeline: [
          {$sort: {"date": 1}},
        ],
        as: fieldToPopulate
      });
      if (fieldToPopulate === 'messages') {
        return chat[0].messages;
      } else {
        return chat[0].users;
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
    chatMsgs = this.getMessagesFromLastDate(chatMsgs);
    const formatedMessages = formatService.requestMsgFormat(chatMsgs);
    return formatedMessages;
  }

  getUserInPool = async function(chatName,userId) {
    try {
      const chat = await Chats.aggregate()
      .match({name: chatName})
      .lookup({
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users",
      })
      .unwind("users")
      .match({"users.id": userId})
      .project({
        "users": 1
      })[0];
      const user = chat ? chat.users : null;
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

  async removeUserFromChat(chatId,userId) {
    try{
      const chat = await Chats.findOneAndUpdate(
        { _id: chatId }, 
        { $pull: { "users": userId} },
        { save: true }
      );
      const user = await Users.findOneAndUpdate(
        { _id: userId },
        { $pull: { "chats": chatId } },
        { save: true }
      );
      user.save();
      return chat.save();
    }catch(err) {
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
    const index = chatMsgs.findIndex(m => this.checkDate(lastMsgDate,m.date));
    if (index !== -1 && index !== 0) {
      chatMsgs = chatMsgs.slice(0, index);
      chatMsgs = this.getMessagesFromLastDate(chatMsgs);
      const formatedMessages = formatService.requestMsgFormat(chatMsgs);
      return formatedMessages;
    }
    return null;
  }

  ////////////////////// inner functions

  async processImage(img) {
    const { buffer, originalname } = img;
    if(originalname == "emptyFile") {
      return {
        data: Buffer.from(''),
        contentType: 'image/*',
        filename: originalname,
      }
    }
    const imagesPath = path.join(".","public","images");
    fs.access(imagesPath, (error) => {
      if (error) {
        fs.mkdirSync(imagesPath);
      }
    });
    
    await sharp(buffer).resize({width: 150, height: 150}).jpeg({ quality: 85 })
    .toFile(path.join(imagesPath, originalname));
    const imageFile = await sharp(path.join(imagesPath, originalname)).toBuffer();
    const image = {
      data: imageFile,
      contentType: 'image/*',
      filename: originalname,
    }
    return image;
  }

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

  async getChat(filter) {
    try{
      const chat = await Chats.findOne(filter);
      return chat
    }catch(err) {
      throw err;
    }
  }

  getMessagesFromLastDate(chatMsgs) {
    if(!chatMsgs || !chatMsgs.length) return [];
    const lastMsgDate = {
      day: chatMsgs[chatMsgs.length -1].date.getUTCDate(),
      month: chatMsgs[chatMsgs.length -1].date.getUTCMonth(),
      year: chatMsgs[chatMsgs.length -1].date.getUTCFullYear()
    }
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
