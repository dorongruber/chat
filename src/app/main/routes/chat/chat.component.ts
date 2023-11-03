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
import { HeaderMenuOption } from '../../models/header-menu-option';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [ControllerService],
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild("chatSideNav") sidenav!: MatSidenav;
  msgContent: string = '';
  messages: Message[] = [];
  lastMsgElement: Element | null = null;
  isLoading = false;
  selectedChat: ChatInMenu = new ChatInMenu('','',new File([],'emptyFile'));
  user!: User;
  menuOptions: HeaderMenuOption[] ;
  componentRef: DynamicComponentRef;
  sidenavComponentRef?: DynamicComponentRef;
  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
    private userService: UserService,
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
    ) {
      this.componentRef = new DynamicComponentRef(Header1Component);
      this.menuOptions = chatMenuOptions;
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
        
        this.messages = await this.chatService.getChatMessages(this.selectedChat.id);
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
   
   this.chatService.newMsg
   .pipe(takeUntil(this.subscriptionContolService.stop$), tap(res => {
      this.onLoadingChange();
      this.messages.push(res);
  }))
   .subscribe(res => {
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
    const indicator = document.getElementById('chat-top-indicator');
    const msgsContainer = document.getElementById('msgs-container');
    let options = {
      root: msgsContainer,
      threshold: [.75],
    }
    if(indicator) {
      let observer = new IntersectionObserver(this.checkScroll.bind(this), options);
      observer.observe(indicator);
    }

  }

  async checkScroll(entires: any) {
    const currentDate = this.messages[0]?.date? this.messages[0]?.date: null;
    if(entires[0].intersectionRatio === 1 && currentDate) {
      
      const msgsContainer = document.getElementById('msgs-container');
      const prevH = msgsContainer!.scrollHeight;
      
      let prevDayMsgs = await this.chatService.getPrevDayMsgs(this.selectedChat.id,currentDate);
      if (prevDayMsgs && prevDayMsgs.length) {
        this.messages.unshift(...prevDayMsgs);
        setTimeout(() => {
          const curH = msgsContainer!.scrollHeight;
          msgsContainer!.scrollTop = curH - prevH;
         })
      } 
    }
  }

  onMessageSubmit(form: NgForm) {
    if (form.invalid) return;
    const messageFormat = this.createMessage(form.value.message);
    this.messages.push(messageFormat);
    this.socketService.sendMessage(messageFormat);
    form.reset();
    setTimeout(() => {
      this.scrollToLastMsg();
    })
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
    const chatMsgsElement = document.getElementById('msgs-container') as HTMLElement;    
    chatMsgsElement.scrollTop = chatMsgsElement.scrollHeight;
  }

  trackMessages(index: number, msg: Message) {    
    return msg.date!.getTime();
  }

}
