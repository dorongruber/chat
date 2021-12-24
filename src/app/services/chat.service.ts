import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Message } from "../main/models/message";
import { User } from "../main/models/user";
import { BaseService } from "./base/base.service";
import { SocketService } from "./socket.service";
import { UserService } from "./user.service";

const URI = 'http://localhost:3000/api/chat/';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  usersInChat = new Subject<[{userId: string, userName: string, chatId: string}]>();
  messages = new Subject<Message>();
  newMenuMsg = new Subject<Message>();
  constructor(
    private baseService: BaseService,
    private socketService: SocketService,
    private userService: UserService,
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

       this.newMenuMsg = socketService.getNewMessageToChatMenu()
       .pipe(map(response => {
         return response;
       })) as Subject<Message>;
     }

     getChatData(id: string) {
       this.baseService.get(URI,id)
       .then(chat => {
         console.log('chat data => ', chat);
       })
       .catch(err => err);
     }

     getChatMessages(id: string) {
       const url = `${URI}messages/`;
       return this.baseService
       .get<{userName: string,
        chatId: string,
        date: Date,
        userId: string,
        message: string}[]>(url,id)
       .then(res => {
        const user = this.userService.get();
        const msgFormat: Message[] = [];
        res.forEach(msg => {
          msgFormat.push({
            message: msg.message,
            userId: msg.userId,
            chatId: msg.chatId,
            userName: msg.userName,
            date: msg.date,
            fromCurrentUser: user.id === msg.userId? true: false,
          });
        })
         console.log('get messages form db res => ', res);
         return msgFormat;
       })
       .catch(err => {throw err});
     }

     deleteChat(chatId: string,userId: string) {
      const ids = `${chatId}/${userId}`;
      return this.baseService.delete(URI,ids)
     }

}

