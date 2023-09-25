import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Chat, ChatInMenu } from "../main/models/chat";
import { Message } from "../main/models/message";
import { takeUntil } from "rxjs/operators";
import { User as FullUser, User } from "../shared/models/user";;
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
  usersInChat = new Subject<[{userId: string, userName: string, chatId: string}]>();
  messages = new Subject<Message>();
  newMenuMsg = new Subject<Message>();
  onChatChange = new Subject<ChatInMenu>();
  chat: ChatInMenu = new ChatInMenu('','',new File([],'emptyFile'));
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
            console.log("errer ChatService ==> ", err); 
          },
        );

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

       this.onChatChange
       .pipe(takeUntil(this.subscriptionContolService.stop$))
       .subscribe(chatData => {
        this.selectedChat = chatData;
      })
     }

     async newChat(id: string,name: string, users: FullUser[], userId: string, img: File) {
      const formData = new FormData();
      const url = `${URI}newchat`;
      formData.append('id', id);
      formData.append('name', name);
      formData.append('users',  JSON.stringify(users.map(u => u.id)));
      formData.append('uId', userId);
      formData.append('image', img);
      try {
         const res = await this.baseService.post(url, formData);
         console.log('new chat res => ', res);
         return res;
       } catch (err: any) {
         if (err)
           return new Error(err);
         return;
       }
     }

     async getChatData(id: string) {
       return this.baseService.get<Chat>(URI,id)
       .then(chat => {
         console.log('chat data => ', chat);
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
            date: msg.date,
            fromCurrentUser: this.userId === msg.userId? true: false,
          });
        })
         console.log('getChatMessages res => ', res);
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
                date: msg.date,
                fromCurrentUser: this.userId === msg.userId? true: false,
              });
            })
           console.log('getPrevDayMsgs res => ', res);
           return msgFormat;
         })
        .catch(err => {throw err});
     }

     deleteChat(chatId: string,userId: string) {
      const ids = `${chatId}/${userId}`;
      return this.baseService.delete(URI,ids)
     }

     set selectedChat(chat: ChatInMenu) {
      this.chat = chat;
     }

     get selectedChat() {
       return this.chat;
     }

}

