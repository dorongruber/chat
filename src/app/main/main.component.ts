import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../services/chats.service';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';
import { User } from 'src/app/shared/models/user';
import { DeviceTypeService } from '../services/devicetype.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  title = "Landing page";
  
  user: User | undefined;
  isMenuOpen = false;
  menuOption = 3;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private socketService: SocketService,
    private chatService: ChatsService,
    private deviceTypeService: DeviceTypeService,
  ) {
      this.router.events.subscribe(res => {
        if(res instanceof NavigationEnd) {
          this.title = res.url.split('/')[2];
        }
      });      
      if(this.deviceTypeService.isMobile) {
        this.router.navigate(["menu"], {relativeTo: this.route.parent});
      } 
   }

  async ngOnInit(): Promise<void> {
    const authUser = JSON.parse(localStorage.getItem('userData') || '');
    let id: string = authUser ? authUser.id : '';

    this.menuOption = this.deviceTypeService.isMobile? 0 : 3;
    this.user = await this.userService.getUserById(id);
    if (this.user)
      this.socketService
      .enterPool(this.user.id, this.user.name,this.chatService.GenerateId(),'generalPool');

  }
}
