import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Chat, ChatInMenu } from "../main/models/chat";
import { Message } from "../main/models/message";
import { takeUntil } from "rxjs/operators";
import { User } from "../shared/models/user";;
import { BaseService } from "./base/base.service";
import { SocketService } from "./socket.service";
import { UserService } from "./user.service";
import { SubscriptionContolService } from "./subscription-control.service";

const DEV_URI = 'http://localhost:3000/api/chat/';
const PROD_URI = 'https://pacific-sierra-73043.herokuapp.com/api/chat/';
const URI = window.location.hostname === 'localhost'? DEV_URI: PROD_URI;
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  newMsg = new Subject<Message>();
  newMenuMsg = new Subject<Message>();
  private onChatChange = new BehaviorSubject<any | null>(null);
  chat: any;
  userId!: string;
  constructor(
    private baseService: BaseService,
    private socketService: SocketService,
    private userService: UserService,
    private subscriptionContolService: SubscriptionContolService,
    )
     {
      this.userService.onUserChange
      .pipe(
        takeUntil(this.subscriptionContolService.stop$))
        .subscribe(
          (user: User) => {
            this.userId = user.id;
          },
          (err) => {
            console.log("errer ChatService", err); 
          },
        );

       this.newMsg = socketService.getNewMessage()
       .pipe(map(response => {
         return response;
       })) as Subject<Message>

       this.newMenuMsg = socketService.getNewMessageToChatMenu()
       .pipe(map(response => {        
         return response;
       })) as Subject<Message>;
     }

    newChat(id: string,name: string, users: User[], img: File, type: string) {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', name);
      formData.append('users',  JSON.stringify(users.map(u => u.id)));
      formData.append('uId', this.userId);
      formData.append('image', img);
      formData.append('type', type);
      try {
         return this.baseService.post<Chat>(URI, formData);
       } catch (err: any) {
         if (err)
           return new Error(err);
         return;
       }
     }

     async getChatData(id: string) {
       return this.baseService.get<Chat>(URI,id)
       .then(chat => {
         return chat;
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
        const msgFormat: Message[] = [];
        res.forEach(msg => {
          msgFormat.push({
            message: msg.message,
            userId: msg.userId,
            chatId: msg.chatId,
            userName: msg.userName,
            date: new Date(msg.date),
            fromCurrentUser: this.userId === msg.userId? true: false,
          });
        })
         return msgFormat;
       })
       .catch(err => {throw err});
     }

     getPrevDayMsgs(chatId: string, date: Date) {
      const url = `${URI}prevDateMsgs/`;
      const args = `${chatId}/${date}`;
      return this.baseService
      .get<{userName: string,
        chatId: string,
        date: Date,
        userId: string,
        message: string}[]>(url, args)
        .then(res => {
          const msgFormat: Message[] = [];
          if(res)
            res.forEach(msg => {
            msgFormat.push({
                message: msg.message,
                userId: msg.userId,
                chatId: msg.chatId,
                userName: msg.userName,
                date: new Date(msg.date),
                fromCurrentUser: this.userId === msg.userId? true: false,
              });
            })
           return msgFormat;
         })
        .catch(err => {throw err});
     }

     deleteChat(chatId: string,userId: string) {
      const ids = `${chatId}/${userId}`;
      return this.baseService.delete<Chat>(URI,ids)
     }

    async setCurrentChat(chat: ChatInMenu) {
      const chatData = await this.getChatData(chat.id);
      this.onChatChange.next(chatData);
     }

     getCurrentChat() {
       return this.onChatChange;
     }

}

