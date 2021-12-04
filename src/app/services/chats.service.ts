import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Chat } from "../main/models/chat";
import { User } from "../shared/models/user";
import { BaseService } from "./base/base.service";

import { SocketService } from "./socket.service";
const URI = 'http://localhost:3000/api/chat/';
const MULTE = 1000000000000000;

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  onNewChat = new Subject<Chat>();
  constructor(
    private baseService: BaseService,
    private socketService: SocketService
    )
  {
    this.onNewChat = this.socketService.joinNewChat()
    .pipe(map((newChat: any) => {
      console.log('new chat => ', newChat);
      return new Chat(newChat.chatId, newChat.chatName);
    })) as Subject<Chat>

    // this.socketService.joinNewChat().subscribe(res => {
    //   console.log('new chat res => ', res);
    //   // const newChat = new Chat(res.chatId, res.chatName);
    //   // this.onNewChat.next(newChat);
    // })
  }



  addChat(name: string, users: User[], userId: string) {
    this.socketService.createChat(this.GenerateId(),name,users, userId);
  }

  GenerateId() {
    const randomId = Number(Math.random() * MULTE).toFixed(0).toString();
    //console.log('randomId -> ', randomId);
    return randomId;
  }
}
