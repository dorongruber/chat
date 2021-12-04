import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Message } from 'src/app/main/models/message';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

const COMPONENT_BASE_ROUTE = '/main/chats/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit ,OnDestroy {
  private subscription = new Subscription();
  private subscriptions = new Subscription();
  msgContent: string = '';
  messageFormat: Message = {};
  messages: Message[] = [];
  chatId$: Observable<string>;
  chatId: string = '';
  chatUsers: {userId: string, userName: string, chatId: string}[] ;
  baseRoute = COMPONENT_BASE_ROUTE;

  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private socketService: SocketService,
    private userService: UserService,
    private el: ElementRef,
    ) {
    this.chatId$ = new Observable<string>();
    this.chatUsers = []
   }

  async ngOnInit(): Promise<void> {
   this.chatId$ = this.route.paramMap.pipe(switchMap(params => {
     return params.getAll('id');
   }))

   this.subscription = this.chatId$.subscribe(async res => {
     this.onLoadingChange();
     this.chatId = res;
     const formDb = await this.chatService.getChatMessages(this.chatId);
     this.messages = formDb;
     setTimeout(() => {
      this.scrollToLastMsg();

    }, 1000);
    this.onLoadingChange();
   });
   this.subscriptions.add(this.subscription);

   this.subscription = this.chatService.usersInChat.subscribe(resUsers => {
    this.chatUsers = [...resUsers];
   })
   this.subscriptions.add(this.subscription);
   this.subscriptions = this.chatService.messages.subscribe(resMsg => {
     this.onLoadingChange();
     this.messages.push(resMsg);
     setTimeout(() => {
      this.scrollToLastMsg();
    }, 1000);
    this.onLoadingChange();
   });
  }

  onLoadingChange() {
    this.isLoading =!this.isLoading;
  }

  onMessageSubmit(form: NgForm) {
    if (form.invalid) return;
    this.messageFormat = this.createMessage(form.value.message);
    this.socketService.sendMessage(this.messageFormat);
    this.messages.push(this.messageFormat);
    this.msgContent = '';
    setTimeout(() => {
      this.scrollToLastMsg();
    }, 1000);
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

  scrollToLastMsg() {
    const chatMsgsElement = document.getElementById('msgs-container') as HTMLElement;

    chatMsgsElement.scrollTop = chatMsgsElement.scrollHeight;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptions.unsubscribe();
  }

}
