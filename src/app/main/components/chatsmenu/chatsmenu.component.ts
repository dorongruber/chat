import { Component, OnInit } from '@angular/core';
import { takeUntil, tap } from "rxjs/operators";
import { mockUserList } from 'src/app/mockData/usersList';
import { ChatService } from 'src/app/services/chat.service';
import { ChatsService } from 'src/app/services/chats.service';
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { ChatInMenu } from '../../models/chat';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';

@Component({
  selector: 'app-chatsmenu',
  templateUrl: './chatsmenu.component.html',
  styleUrls: ['./chatsmenu.component.scss']
})
export class ChatsmenuComponent implements OnInit {
  isMobile = false;

  chats: ChatInMenu[] = [];
  fliteredChats: ChatInMenu[] = [];
  users = mockUserList;
  ////////////
  user!: User;
  constructor(
    private userService: UserService,
    private deviceTypeService: DeviceTypeService,
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
      this.fliteredChats.push(newChat);
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

  FilterUsers(inputValue: string) {
    this.fliteredChats = this.chats.filter(chat => chat.name.includes(inputValue));    
  }

  async initMenu() {
    const resChat = await this.chatsService.getChats(this.user.id);
    this.chats = this.fliteredChats = [...resChat];
  }

  chatTrackBy(index: number,chat: ChatInMenu) {
    return chat.id;
  }

}
