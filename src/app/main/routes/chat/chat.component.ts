import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Message } from 'src/app/main/models/message';
import { ControllerService } from 'src/app/services/base/controller.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { ChatInMenu } from '../../models/chat';

const COMPONENT_BASE_ROUTE = '/main/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit ,OnDestroy {
  private subscription = new Subscription();
  private subscriptions = new Subscription();
  msgContent: string = '';
  messageFormat: Message = {};
  messages: Message[] = [];
  chatId$: Observable<string>;
  chatId: string = '';
  chatUsers: {userId: string, userName: string, chatId: string}[] ;
  baseRoute = COMPONENT_BASE_ROUTE;
  lastMsgElement: Element | null = null;
  isLoading = false;
  selectedChat: ChatInMenu = new ChatInMenu('','',new File([],'emptyFile'));
  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private socketService: SocketService,
    private userService: UserService,
    private controllerService: ControllerService,
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
     this.messages = formDb.reverse();
     setTimeout(() => {
      this.scrollToLastMsg();
      this.scrollObservable();
    });
    this.onLoadingChange();
   });
   this.subscriptions.add(this.subscription);

   const user = this.userService.get();
   this.socketService.connectToChat(user.id, user.name, this.chatId);

   this.subscription = this.chatService.usersInChat.subscribe(resUsers => {
    this.chatUsers = [...resUsers];
   })
   this.subscriptions.add(this.subscription);
   this.subscriptions = this.chatService.messages.subscribe(resMsg => {
     this.onLoadingChange();
     //this.messages.push(resMsg);
     this.messages = [resMsg, ...this.messages];
     setTimeout(() => {
      this.scrollToLastMsg();
    });
    this.onLoadingChange();
   });
  }

  ngAfterViewInit(): void {
    this.selectedChat = this.chatService.selectedChat;
    this.chatService.onChatChange.subscribe(chatData => {
      this.selectedChat = this.chatService.selectedChat;
    });
    if ('scrollRestoration' in history) {
      // Back off, browser, I got this...
      console.log('??????????????????????????????');

      window.history.scrollRestoration = 'manual';
    }
  }

  onLoadingChange() {
    this.isLoading =!this.isLoading;
  }

  scrollObservable() {
    const lmEl = document.querySelector('#chat-top-indicator');
    let options = {
      root: document.querySelector('#msgs-container'),
      threshold: [1],
    }
    if(lmEl) {
      let observer = new IntersectionObserver(this.checkScroll.bind(this), options);

      if(!this.lastMsgElement)
        this.lastMsgElement = lmEl;
      else {
        observer.unobserve(this.lastMsgElement)
        this.lastMsgElement = lmEl;
      }
      observer.observe(this.lastMsgElement);
    }

  }

  async checkScroll(entires: any) {
    console.log('scroll event -> ',entires[0]);
    let prevDayMsgs;
    if(entires[0].intersectionRatio === 1) {
      console.log('load prev day');
      const currentDate = this.messages[0]?.date? this.messages[0]?.date: null;
      if(currentDate)
        prevDayMsgs = await this.chatService.getPrevDayMsgs(this.chatId,currentDate);
        if (prevDayMsgs && prevDayMsgs.length) {
          this.messages = [...this.messages,...prevDayMsgs];
          console.log('messages len -> ', this.messages.length);
        } else {
          //test save scroll position
          await this.fixScrollOnFirstMsgOfDay();
          setTimeout(() => {
            this.messages = [...this.messages, ...this.messages];
          },2000)
          console.log('test save scroll position messages len -> ', this.messages.length);
        }
    }
  }

  onMessageSubmit(form: NgForm) {
    if (form.invalid) return;
    this.messageFormat = this.createMessage(form.value.message);
    this.socketService.sendMessage(this.messageFormat);
    //this.messages.push(this.messageFormat);
    this.messages = [this.messageFormat, ...this.messages];
    this.msgContent = '';
    setTimeout(() => {
      this.scrollToLastMsg();
    });
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

  FocusOnChat() {
    this.controllerService.onChatFocusChange(this.chatId);
  }

  async fixScrollOnFirstMsgOfDay() {
    const chatMsgsElement = document.querySelector('#msgs-container') as HTMLElement;
    const firstMsgContainer = (document.querySelectorAll('.single-msg') as NodeListOf<HTMLElement>)[0];
    console.log('firstMsgContainer ==> ', firstMsgContainer.offsetTop, window.pageYOffset );

  }

  scrollToLastMsg() {
    const chatMsgsElement = document.querySelector('#msgs-container') as HTMLElement;
    if(chatMsgsElement)
      chatMsgsElement.scrollTop = 0;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptions.unsubscribe();
  }

}
