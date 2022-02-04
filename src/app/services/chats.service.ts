import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Chat, ChatInMenu } from "../main/models/chat";
import { User } from "../shared/models/user";
import { BaseService } from "./base/base.service";
import { ChatService } from './chat.service';
import { SocketService } from "./socket.service";

const URI = 'http://localhost:3000/api/chat/';
const USER_URI = 'http://localhost:3000/api/user/';
const MULTE = 1000000000000000;

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  onNewChat = new Subject<Chat>();
  constructor(
    private baseService: BaseService,
    private chatService: ChatService,
    private socketService: SocketService,
    )
  {
    this.onNewChat = this.socketService.joinNewChat()
    .pipe(map((newChat: any) => {
      console.log('new chat => ', newChat.chatName);
      return new Chat(newChat.chatId, newChat.chatName, newChat.img);
    })) as Subject<Chat>
  }

  getChats(userId: string) {
    const url =`${USER_URI}chats/`;
    return this.baseService.get<ChatInMenu[]>(url,userId)
    .then(res => {
      console.log('get chats  res -> ', res);
      return res.map(c => {
        const chat = new ChatInMenu(c.id,c.name,c.img);
        chat.lastMsg = c.lastMsg;
        return chat;
      });
    })
    .catch(err => {
      if (err.status === 404)
        return [];
      throw err;
    })
  }

  async addChat(chatId: string, name: string, users: User[], userId: string, img: File) {
    const id = chatId.length === 0? this.GenerateId(): chatId;
    const savedChat = await this.chatService.newChat(id,name,users,userId,img);
    this.socketService.createChat(id,name,users, userId);
  }

  GenerateId() {
    const randomId = Number(Math.random() * MULTE).toFixed(0).toString();
    return randomId;
  }
}
