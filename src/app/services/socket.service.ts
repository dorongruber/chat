import { Injectable } from "@angular/core";
import { observable, Observable } from "rxjs";
import { io } from 'socket.io-client';
import { Message } from "../main/models/message";
import { User } from "../shared/models/user";

const DEV_SOCKET_ENDPOINT = 'http://localhost:3000/';
const PROD_SOCKET_ENDPOINT ='https://pacific-sierra-73043.herokuapp.com/'
//const SOCKET_ENDPOINT = 'http://10.100.102.8:3000/';
const SOCKET_ENDPOINT = window.location.hostname === 'localhost'? DEV_SOCKET_ENDPOINT: PROD_SOCKET_ENDPOINT;
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  constructor() {
    this.socket = io(SOCKET_ENDPOINT)
  }

  enterPool(userId: string, userName: string, chatId: string, chatName: string) {
    this.socket.emit('EnterPool', ({userId,userName,chatId,chatName}));
  }

  connectToChat(userId: string,userName: string,chatId: string) {
    this.socket.emit('connectToChat',({userId,userName,chatId}));
  }

  disconnectFromChat(userId: string,chatId: string) {
    this.socket.emit('disconnectFromChat', ({userId,chatId}));
  }

  createChat(chatId: string, chatName: string, chatUsers: User[], userId: string) {
    this.socket.emit('createChat', ({chatId, chatName, chatUsers,userId}))
  }

  deleteChat(chatId: string) {
    this.socket.emit('deleteChat', ({chatId}));
  }

  addToChat(userId: string, chatId: string) {
    this.socket.emit('addToChat', ({userId,chatId}));
  }

  removeFromChat(userId: string, chatId: string) {
    this.socket.emit('removeFromChat', ({userId,chatId}));
  }


  sendMessage(msgFormat: Message) {
    const { message, userId, chatId, userName, date} = msgFormat;
    this.socket.emit('sendMessage', ({userId, chatId, message, date, userName}));
  }

  addToChatRequest(userId: string, chatId: string) {}

  getNewMessage() {
    const observable = new Observable(observer => {
      this.socket.on('newMessage', (messageObj:Message) => {
        observer.next(messageObj);
      })
    })
    return observable;
  }

  getNewMessageToChatMenu() {
    const observable = new Observable(observer => {
      this.socket.on('newMessageToChatMenu',(messageObj:Message) => {
        observer.next(messageObj);
      })
    })
    return observable;
  }

  joinNewChat() {
    const observable = new Observable(observer => {
      this.socket.on('JoinChat', (newChat: {chatName: string,chatId: string}) => {
        observer.next(newChat);
      })
    })
    return observable;
  }

}
