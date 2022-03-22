import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ControllerService } from 'src/app/services/base/controller.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { ChatInMenu } from '../../../models/chat';

@Component({
  selector: 'app-chatmenuitem',
  templateUrl: './chatmenuitem.component.html',
  styleUrls: ['./chatmenuitem.component.scss']
})
export class ChatmenuitemComponent implements OnInit {
  @Input() chat: ChatInMenu = new ChatInMenu('','',new File([],'emptyFile'));

  subscription = new Subscription();
  private subscriptions = new Subscription();
  constructor(
    private userService: UserService,
    private controllerService: ControllerService,
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.controllerService.onChatFocus.subscribe(chatId => {
      this.resetMsgAndCount(chatId);
    });
    this.subscriptions.add(this.subscription);
  }

  OnChatSelect(id: string) {
    const user = this.userService.get();
    const userName = user.name;
    const userId = user.id;
    this.resetMsgAndCount(id);
    this.socketService.connectToChat(userId, userName, id);
  }

  resetMsgAndCount(id: string) {
    if(id === this.chat.id) {
      this.chatService.onChatChange.next(this.chat);
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
