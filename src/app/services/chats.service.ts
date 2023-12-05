import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map, takeUntil, tap } from "rxjs/operators";
import { Chat, ChatInMenu } from "../main/models/chat";
import { User } from "../shared/models/user";
import { BaseService } from "./base/base.service";
import { ChatService } from './chat.service';
import { SocketService } from "./socket.service";
import { SubscriptionContolService } from "./subscription-control.service";

//const USER_URI = 'http://localhost:3000/api/chat/';
const DEV_URI = 'http://localhost:3000/api/user/';
const PROD_URI = 'https://pacific-sierra-73043.herokuapp.com/api/user/';
const MULTE = 1000000000000000;
const URI = window.location.hostname === 'localhost'? DEV_URI: PROD_URI;
@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  onNewChat = new Subject<Chat>();
  constructor(
    private baseService: BaseService,
    private chatService: ChatService,
    private socketService: SocketService,
    private subscriptionContolService: SubscriptionContolService,
    )
  {
    this.socketService.joinNewChat()
    .pipe(takeUntil(this.subscriptionContolService.stop$), tap((newChat: any) => {      
      const chatToSend = new Chat(newChat._id,newChat.chatId, newChat.chatName, newChat.img);
      this.onNewChat.next(chatToSend)
    })).subscribe();
  }

  getChats(userId: string) {

    const url =`${URI}chats/`;
    return this.baseService.get<ChatInMenu[]>(url,userId)
    .then(res => {      
      const isEmpty = Object.keys(res).length == 0;
      const incomingChats = isEmpty ? [] : res.map(c => {
        const chat = new ChatInMenu(c._id,c.id,c.name,c.img);
        chat.lastMsg = c.lastMsg;
        return chat;
      });
      return incomingChats;
    })
    .catch(err => {
      if (err.status === 404)
        return [];
      throw err;
    })
  }

  async addChat(chatId: string, name: string, users: User[], img: File, type: string) {
    const id = chatId.length === 0? this.GenerateId(): chatId;
    const savedChat = await this.chatService.newChat(id,name,users,img, type);
    if(!(savedChat instanceof Error) && savedChat) {
      return true;
    }
    return false;
  }

  GenerateId() {
    const randomId = Number(Math.random() * MULTE).toFixed(0).toString();
    return randomId;
  }

}
