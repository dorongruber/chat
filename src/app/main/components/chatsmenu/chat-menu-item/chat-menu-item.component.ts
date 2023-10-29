import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControllerService } from 'src/app/services/base/controller.service';
import { ChatService } from 'src/app/services/chat.service';
import { SocketService } from 'src/app/services/socket.service';
import { ChatInMenu } from '../../../models/chat';
import { takeUntil } from "rxjs/operators";
import { User } from 'src/app/shared/models/user';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-chatmenuitem',
  templateUrl: './chat-menu-item.component.html',
  styleUrls: ['./chat-menu-item.component.scss']
})
export class ChatmenuitemComponent implements OnChanges {
  @Input() chat: ChatInMenu = new ChatInMenu('','',new File([],'emptyFile'));
  @Input()user!: User;
  
  asImage!: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private controllerService: ControllerService,
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private subscriptionContolService: SubscriptionContolService,
  ) { 
    this.controllerService.onChatFocus
    .pipe(takeUntil(this.subscriptionContolService.stop$))
    .subscribe(chatId => {
      this.resetMsgAndCount(chatId);
    });
  }

  ngOnChanges(): void {
    this.asImage = this.checkImage(this.chat.img);
  }

  async OnChatSelect(id: string) {
    const userName = this.user.name;
    const userId = this.user.id;
    await this.resetMsgAndCount(id);
    this.socketService.connectToChat(userId, userName, id);    
    this.router.navigate(['chat', this.chat.id,], {relativeTo: this.route.parent});
  }

  async resetMsgAndCount(id: string) {
    if(id === this.chat.id) {
      await this.chatService.setCurrentChat(this.chat);
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
