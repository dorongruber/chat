import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, tap } from "rxjs/operators";
import { mockUserList } from 'src/app/mockData/usersList';
import { ChatService } from 'src/app/services/chat.service';
import { ChatsService } from 'src/app/services/chats.service';
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { RouterService } from 'src/app/services/router.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { ChatInMenu } from '../../models/chat';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';

const COMPONENT_BASE_ROUTE = '/main/chats';

@Component({
  selector: 'app-chatsmenu',
  templateUrl: './chatsmenu.component.html',
  styleUrls: ['./chatsmenu.component.scss']
})
export class ChatsmenuComponent implements OnInit {
  isMobile = false;

  chats: ChatInMenu[] = [];
  users = mockUserList;
  ////////////
  user!: User;
  constructor(
    private routerService: RouterService,
    private userService: UserService,
    private deviceTypeService: DeviceTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    private chatService: ChatService,
    private subscriptionContolService: SubscriptionContolService,
    ) {
      this.userService.onUserChange
      .pipe(
        takeUntil(this.subscriptionContolService.stop$), tap((user: User) => {
          this.user = user;
            this.initMenu();
        }))
        .subscribe(
          () => {},
          (err) => {
            console.log("errer delete chat component==> ", err); 
          },
        );
    }

    ngOnInit() {
      this.isMobile = this.deviceTypeService.isMobile;

      this.chatsService.onNewChat
      .pipe(takeUntil(this.subscriptionContolService.stop$))
      .subscribe(res => {
        const newChat = new ChatInMenu(res.id,res.name, res.img);
        this.chats.push(newChat);
      });
     
      this.chatService.newMenuMsg
      .pipe(takeUntil(this.subscriptionContolService.stop$))
      .subscribe(resMsg => {
        if (resMsg && resMsg.chatId) {
          this.chats.find(c => {
            if (c.id === resMsg.chatId && resMsg.message) {
              c.lastMsg = resMsg;
              c.newmsgscounter = c.newmsgscounter + 1;
              c.onMsgChange.next(resMsg);
              c.onCounterChange.next(c.newmsgscounter);
            }
          });
        }
      });
    }

  async initMenu() {
    const resChat = await this.chatsService.getChats(this.user.id);
    this.chats = [...resChat];
    this.routerService.onRouteChange
    .pipe(takeUntil(this.subscriptionContolService.stop$))
    .subscribe(currentURL => {
      if (this.CheckInitRoute(currentURL))
        this.router.navigate(['./landingpage'], {relativeTo: this.route});
    });
  }

  CheckInitRoute(currentURL: string) {
    if (
      currentURL === COMPONENT_BASE_ROUTE &&
      this.chats.length &&
      !this.isMobile) return true;
    return false;
  }

}
