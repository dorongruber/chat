import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../services/chats.service';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';
import { User } from 'src/app/shared/models/user';
import { DeviceTypeService } from '../services/devicetype.service';
import { ControllerService } from '../services/base/controller.service';
import { NavigationEnd, Router } from '@angular/router';
import { SubscriptionContolService } from '../services/subscription-control.service';
import { takeUntil, take, map } from "rxjs/operators";

const COMPONENT_BASE_ROUTE = '/main';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})
export class MainComponent implements OnInit {
  title = "Landing page";
  baseRoute = COMPONENT_BASE_ROUTE;
  user: User | undefined;
  isMobile = false;
  isMenuOpen = false;
  menuOption = 3;
  constructor(
    private router: Router,
    private userService: UserService,
    private socketService: SocketService,
    private chatService: ChatsService,
    private deviceTypeService: DeviceTypeService,
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
  ) { }

  async ngOnInit(): Promise<void> {

    let id: string = '';
    const authUser = JSON.parse(localStorage.getItem('userData') || '');
    if(authUser)
      id = authUser.id;

    this.isMobile = this.deviceTypeService.isMobile;
    this.menuOption = this.isMobile? 0 : 3;
    this.user = await this.userService.getUserById(id);
    if (this.user)
      this.socketService
      .enterPool(this.user.id, this.user.name,this.chatService.GenerateId(),'generalPool');

      this.controllerService.onMenuStateChange
      .pipe(takeUntil(this.subscriptionContolService.stop$), take(1), map(obj => {
        if(this.isMobile) {
          this.setHeaderTitleOnMobile(obj.option);
          this.mobileMenuControl(obj);
        } else {
          this.descktopMenuControl(obj);
        }
      }))
      .subscribe();
      this.router.events.subscribe(res => {
        if(res instanceof NavigationEnd) {
          this.title = res.url.split('/')[2];
        }
      })
  }

  setHeaderTitleOnMobile(index: number) {
    switch(index) {
      case 0:
        this.title = 'Landing page';
        break;
      case 2:
        this.title = 'User Info';
        break;
      case 3:
        this.title = 'Chats';
        break;
    }
  }

  mobileMenuControl(obj: {state: boolean, option: number}) {
    if(obj.state){
      this.isMenuOpen = obj.state;
      this.menuOption = obj.option? obj.option: 3;
    } else {
      setTimeout(() => {
        this.isMenuOpen = obj.state;
      }, 1000);
      this.menuOption = obj.option !== undefined? obj.option: 3;
    }
  }

  descktopMenuControl(obj: {state: boolean, option: number}) {
    this.isMenuOpen = obj.state;
    if(this.isMenuOpen)
      this.menuOption = obj.option? obj.option: 3;
    else {
      setTimeout(() => {
        this.menuOption = obj.option ? obj.option: 3;
      });
    }
  }

}
