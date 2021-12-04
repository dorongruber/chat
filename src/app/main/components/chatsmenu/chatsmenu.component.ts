import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mockChatsList } from 'src/app/mockData/chatsList';
import { mockUserList } from 'src/app/mockData/usersList';
import { ControllerService } from 'src/app/services/base/controller.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatsService } from 'src/app/services/chats.service';
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { RouterService } from 'src/app/services/router.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { ChatInMenu } from '../../models/chat';

const COMPONENT_BASE_ROUTE = '/main/chats';

@Component({
  selector: 'app-chatsmenu',
  templateUrl: './chatsmenu.component.html',
  styleUrls: ['./chatsmenu.component.scss']
})
export class ChatsmenuComponent implements OnInit,OnChanges {
  isMenuOpen = false;
  //mock data
  chats: ChatInMenu[] = [];
  users = mockUserList;
  ////////////
  @Input() user: User | undefined;
  randIndex = 0;
  subscription = new Subscription();
  private subscriptions = new Subscription();
  constructor(
    private socketService: SocketService,
    private routerService: RouterService,
    private userService: UserService,
    private deviceTypeService: DeviceTypeService,
    private controllerService: ControllerService,
    private router: Router,
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    private chatService: ChatService,
    ) {}

    ngOnInit() {
      this.subscription = this.chatsService.onNewChat.subscribe(res => {
        console.log('new chat subject -> ', res);
        const newChat = new ChatInMenu(res.id,res.name);
        this.chats.push(newChat);
      });

      this.subscriptions.add(this.subscription);
      this.subscription = this.chatService.newMenuMsg.subscribe(resMsg => {
        console.log('new mesggsas -> ', resMsg);
        if (resMsg && resMsg.chatId) {
          this.chats.find(c => {
            //console.log('chat =>>>> ', c);
            if (c.id === resMsg.chatId && resMsg.message) {
              c.lastMsg = resMsg;
              c.newmsgscounter = c.newmsgscounter + 1;
              c.onMsgChange.next(resMsg);
              c.onCounterChange.next(c.newmsgscounter);
            }
          });
        }
      });
      this.subscriptions.add(this.subscription);
    }

  async ngOnChanges() {
    if(this.user) {
      console.log('chats menu-> ', this.user)
      this.randIndex = Math.floor(Math.random() * 4);

      const resChat = await this.userService.getChats(this.user.id);
      console.log('resChat -> ',resChat);

      this.chats = [...resChat];
      this.subscription = this.routerService.onRouteChange.subscribe(currentURL => {
        if (this.CheckInitRoute(currentURL))
          this.router.navigate(['./landingpage'], {relativeTo: this.route});
      });
      this.subscriptions.add(this.subscription);
      this.subscription = this.controllerService.onMenuStateChange.subscribe(state => {
        this.isMenuOpen = state;
      })
    }
  }

  CheckInitRoute(currentURL: string) {
    const isMobile = this.deviceTypeService.isMobile;
    if (
      currentURL === COMPONENT_BASE_ROUTE &&
      this.chats.length &&
      !isMobile) return true;
    return false;
  }

  OnChatSelect(id: string) {
    const user = this.userService.get();
    const userName = user.name;
    const userId = user.id;
    this.resetMsgAndCount(id);
    this.socketService.connectToChat(userId, userName, id);
  }

  resetMsgAndCount(id: string) {
    this.chats.find(c => {
      if(c.id === id) {
        c.newmsgscounter = 0;
        c.resetLastMessage();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptions.unsubscribe();
  }

}
