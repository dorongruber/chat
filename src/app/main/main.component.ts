import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../services/chats.service';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';
import { User } from 'src/app/shared/models/user';
import { DeviceTypeService } from '../services/devicetype.service';
import { ControllerService } from '../services/base/controller.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

const COMPONENT_BASE_ROUTE = '/main';
const ids = ['doron123', 'bar876'];
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})
export class MainComponent implements OnInit {
  title = "Landing page"
  baseRoute = COMPONENT_BASE_ROUTE;
  user: User | undefined;
  isMobile = false;
  isMenuOpen = false;
  menuOption = 3;
  subscription = new Subscription();
  private subscriptions = new Subscription();
  constructor(
    private router: Router,
    private userService: UserService,
    private socketService: SocketService,
    private chatService: ChatsService,
    private deviceTypeService: DeviceTypeService,
    private controllerService: ControllerService,
  ) { }

  async ngOnInit(): Promise<void> {
    // const index = Math.floor(Math.random() * 2);
    // let id = ids[index];
    let id: string = '';
    const authUser = JSON.parse(localStorage.getItem('userData') || '');
    console.log('user auth => ', authUser);
    if(authUser)
      id = authUser.id;
    console.log('id -> ', id);

    this.isMobile = this.deviceTypeService.isMobile;
    this.menuOption = this.isMobile? 0 : 3;
    this.user = await this.userService.getUserById(id);
    if (this.user)
      this.socketService
      .enterPool(this.user.id, this.user.name,this.chatService.GenerateId(),'generalPool');

      this.subscription = this.controllerService.onMenuStateChange.subscribe(obj => {
        console.log('onMenuStateChange => ', obj);

        this.isMenuOpen = obj.state;
        if(this.isMenuOpen)
          this.menuOption = obj.option? obj.option: 3;
        else {
          setTimeout(() => {
            this.menuOption = obj.option? obj.option: 3;
          }, 1000);
        }
      })
      this.router.events.subscribe(res => {
        if(res instanceof NavigationEnd) {
          console.log(' if(res instanceof NavigationEnd) -> ', res.url.split('/'));
          this.title = res.url.split('/')[2];
        }
      })
  }

}
