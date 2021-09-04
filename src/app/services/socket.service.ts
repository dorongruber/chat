import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io } from 'socket.io-client';

const SOCKET_ENDPOINT = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  constructor() {
    this.socket = io(SOCKET_ENDPOINT)
  }

  connectToChat(userId: string,userName: string,chatId: string) {
    this.socket.emit('connectToChat',({userId,userName,chatId}));
  }

  disconnectFromChat(userId: string,chatId: string) {
    this.socket.emit('disconnectFromChat', ({userId,chatId}));
  }

  createChat(chatId: string) {
    this.socket.emit('createChat', ({chatId}))
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


  sendMessage(message: string, userId: string, chatId: string) {
    this.socket.emit('sendMessage', ({userId, chatId, message}));
  }

  addToChatRequest(userId: string, chatId: string) {}

  getNewMessage() {
    const observable = new Observable(observer => {
      this.socket.on('newMessage', (messageObj: {userId: string,message: string}) => {
        observer.next(messageObj.message);
      })
    })
    return observable;
  }

  getUsersinChat() {
    const observable = new Observable(observer => {
      this.socket.on('inChat', (chatUserObj:{userId: string, userName: string, chatId: string}) => {
        observer.next(chatUserObj);
      })
    })
    return observable;
  }
}
