import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControllerService } from 'src/app/services/base/controller.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { ChatInMenu } from '../../../models/chat';
import { takeUntil } from "rxjs/operators";
import { User } from 'src/app/shared/models/user';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
@Component({
  selector: 'app-chatmenuitem',
  templateUrl: './chatmenuitem.component.html',
  styleUrls: ['./chatmenuitem.component.scss']
})
export class ChatmenuitemComponent implements OnInit {
  @Input() chat: ChatInMenu = new ChatInMenu('','',new File([],'emptyFile'));

  user!: User;
  constructor(
    private userService: UserService,
    private controllerService: ControllerService,
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private subscriptionContolService: SubscriptionContolService,
  ) { 
    this.userService.onUserChange
      .pipe(
        takeUntil(this.subscriptionContolService.stop$))
        .subscribe(
          (user: User) => {
            this.user = user;
          },
          (err) => {
            console.log("errer ChatmenuitemComponent ==> ", err); 
          },
        );
  }

  ngOnInit(): void {
    this.controllerService.onChatFocus
    .pipe(takeUntil(this.subscriptionContolService.stop$))
    .subscribe(chatId => {
      this.resetMsgAndCount(chatId);
    });
  }

  OnChatSelect(id: string) {
    const userName = this.user.name;
    const userId = this.user.id;
    this.resetMsgAndCount(id);
    this.socketService.connectToChat(userId, userName, id);
  }

  resetMsgAndCount(id: string) {
    if(id === this.chat.id) {
      this.chatService.setCurrentChat(this.chat);
      this.chat.newmsgscounter = 0;
    }
  }

  checkImage(img: File): boolean {
    return img && (img as any).data.data;
  }

  Transform(img: any) {
    const imgURL = img.data.data.includes('data:image/')? img.data.data : 'data:image/*;base64,' + img.data.data;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgURL);
  }
}
