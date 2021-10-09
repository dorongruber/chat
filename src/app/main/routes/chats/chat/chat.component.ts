import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { observable, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Message } from 'src/app/main/models/message';
import { ChatService } from 'src/app/services/chat.service';
import { ChatsService } from 'src/app/services/chats.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

const COMPONENT_BASE_ROUTE = '/main/chats/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private subscriptions = new Subscription();
  msgContent: string = '';
  messageFormat: Message = {};
  messages: Message[] = [];
  chatId$: Observable<string>;
  chatId: string = '';
  chatUsers: {userId: string, userName: string, chatId: string}[] ;
  baseRoute = COMPONENT_BASE_ROUTE;
  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private socketService: SocketService,
    private userService: UserService,
    ) {
    this.chatId$ = new Observable<string>();
    this.chatUsers = []
   }

  async ngOnInit(): Promise<void> {
   this.chatId$ = this.route.paramMap.pipe(switchMap(params => {
     return params.getAll('id');
   }))

   this.subscription = this.chatId$.subscribe(res => {
     this.chatId = res;
     console.log('current open chat -> ', this.chatId);
   });
   this.subscriptions.add(this.subscription);

   this.subscription = this.chatService.usersInChat.subscribe(resUsers => {
    this.chatUsers = [...resUsers];
   })
   this.subscriptions.add(this.subscription);
   this.subscriptions = this.chatService.messages.subscribe(resMsg => {
     this.messages.push(resMsg);
   });

   const formDb = await this.chatService.getChatMessages(this.chatId);
   console.log('messages from db => ', formDb);
   this.messages = formDb;
  }

  onMessageSubmit(form: NgForm) {
    if (form.invalid) return;
    this.messageFormat = this.createMessage(form.value.message);
    this.socketService.sendMessage(this.messageFormat);
    this.messages.push(this.messageFormat);
    console.log('messgaes => ', this.messages);
    this.msgContent = '';
  }

  createMessage(msg: string): Message {
    const userId = this.userService.get().id;
    const userName = this.userService.get().name;
    const date = new Date();
    return  {
      message: msg,
      userId: userId,
      chatId: this.chatId,
      userName: userName,
      date: date,
      fromCurrentUser: true,
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptions.unsubscribe();
  }

}
