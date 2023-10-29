import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/main/models/message';
import { ControllerService } from 'src/app/services/base/controller.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { ChatInMenu } from '../../models/chat';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { takeUntil } from "rxjs/operators";
import { User } from 'src/app/shared/models/user';
import { MatSidenav } from '@angular/material/sidenav';
import { chatMenuOptions } from 'src/app/main/consts/menuoptionslists';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { Header1Component } from '../../components/headers/header1/header1.component';

const COMPONENT_BASE_ROUTE = '/main/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [ControllerService],
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild("chatSideNav") sidenav!: MatSidenav;
  msgContent: string = '';
  messageFormat: Message = {};
  messages: Message[] = [];
  baseRoute = COMPONENT_BASE_ROUTE;
  lastMsgElement: Element | null = null;
  isLoading = false;
  selectedChat: ChatInMenu = new ChatInMenu('','',new File([],'emptyFile'));
  user!: User;
  menuOPtions = chatMenuOptions;
  componentRef = new DynamicComponentRef(Header1Component);
  sidenavComponentRef?: DynamicComponentRef;
  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
    private userService: UserService,
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
    ) {
      this.controllerService.onMenuStateChange
      .pipe(takeUntil(this.subscriptionContolService.stop$), tap((res) => {
        this.sidenavComponentRef = res?.componentRef;
        this.sidenav.toggle();
      }))
      .subscribe();
    this.userService.onUserChange
      .pipe(takeUntil(this.subscriptionContolService.stop$))
      .subscribe(
        (user: User) => {
          this.user = user;
        },
        (err) => {
          console.log("errer ChatComponent ==> ", err); 
        },
      );

    this.chatService.getCurrentChat()
      .pipe(takeUntil(this.subscriptionContolService.stop$), tap(async res => {
        this.onLoadingChange();
        this.selectedChat = res;       
        
        const formDb = await this.chatService.getChatMessages(this.selectedChat.id);
        this.messages = formDb.reverse();
        setTimeout(() => {
          this.scrollToLastMsg();
          this.scrollObservable();
        });
     }))
      .subscribe(() => {
        this.onLoadingChange();
      });
   }

  ngOnInit() {
   
   this.chatService.messages
   .pipe(takeUntil(this.subscriptionContolService.stop$), tap(resMsg => {
      this.onLoadingChange();
      this.messages = [resMsg, ...this.messages];
      setTimeout(() => {
        this.scrollToLastMsg(); 
      });
  }))
   .subscribe(resMsg => {
    this.onLoadingChange();
   });
  }

  ngAfterViewInit(): void {
    if ('scrollRestoration' in history) {
      window.history.scrollRestoration = 'manual';
    }
  }

  onLoadingChange() {
    this.isLoading = !this.isLoading;
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
    let prevDayMsgs;
    if(entires[0].intersectionRatio === 1) {
      const currentDate = this.messages[0]?.date? this.messages[0]?.date: null;
      if(currentDate)
        prevDayMsgs = await this.chatService.getPrevDayMsgs(this.selectedChat.id,currentDate);
        if (prevDayMsgs && prevDayMsgs.length) {
          this.messages = [...this.messages,...prevDayMsgs];
        } 
    }
  }

  onMessageSubmit(form: NgForm) {
    if (form.invalid) return;
    this.messageFormat = this.createMessage(form.value.message);
    this.socketService.sendMessage(this.messageFormat);
    this.messages = [this.messageFormat, ...this.messages];
    this.msgContent = '';
    setTimeout(() => {
      this.scrollToLastMsg();
    });
  }

  createMessage(msg: string): Message {
    const date = new Date();
    return  {
      message: msg,
      userId: this.user.id,
      chatId: this.selectedChat.id,
      userName: this.user.name,
      date: date,
      fromCurrentUser: true,
    };
  }

  FocusOnChat() {
    this.controllerService.onChatFocusChange(this.selectedChat.id);
  }


  scrollToLastMsg() {
    const chatMsgsElement = document.querySelector('#msgs-container') as HTMLElement;
    if(chatMsgsElement)
      chatMsgsElement.scrollTop = 0;
  }

}
