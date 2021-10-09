import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Message } from "../main/models/message";
import { User } from "../main/models/user";
import { BaseService } from "./base/base.service";
import { SocketService } from "./socket.service";

const URI = 'http"//localhost:3000/api/chat/';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  usersInChat = new Subject<[{userId: string, userName: string, chatId: string}]>();
  messages = new Subject<Message>();
  constructor(
    private baseService: BaseService,
    socketService: SocketService
    )
     {
       this.usersInChat = socketService.getUsersinChat()
       .pipe(map(response => {
         console.log('usersInChat -> ', response);
         return response
       })) as Subject<[{userId: string, userName: string, chatId: string}]>

       this.messages = socketService.getNewMessage()
       .pipe(map(response => {
         console.log('new msgs -> ', response);
         return response;
       })) as Subject<Message>
     }

     getChatData(id: string) {
       this.baseService.get(URI,id)
       .then(chat => {
         console.log('chat data => ', chat);
       })
       .catch(err => err);
     }

}
