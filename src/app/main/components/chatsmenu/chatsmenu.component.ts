import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mockChatsList } from 'src/app/mockData/chatsList';
import { mockUserList } from 'src/app/mockData/usersList';
import { ControllerService } from 'src/app/services/base/controller.service';
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { RouterService } from 'src/app/services/router.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

const COMPONENT_BASE_ROUTE = '/main/chats';

@Component({
  selector: 'app-chatsmenu',
  templateUrl: './chatsmenu.component.html',
  styleUrls: ['./chatsmenu.component.scss']
})
export class ChatsmenuComponent implements OnInit {
  isMenuOpen = false;
  //mock data
  chats = mockChatsList;
  users = mockUserList;
  ////////////

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
    private route: ActivatedRoute)
     {
      this.subscription = this.routerService.onRouteChange.subscribe(currentURL => {
        console.log('chats get route -> ', currentURL);
        if (this.CheckInitRoute(currentURL))
          this.router.navigate(['./landingpage'], {relativeTo: this.route});
      });
      this.subscriptions.add(this.subscription);
      this.subscription = this.controllerService.onMenuStateChange.subscribe(state => {
        this.isMenuOpen = state;
      })
     }

  ngOnInit(): void {

    this.randIndex = Math.floor(Math.random() * 4);
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
    console.log('chats get user -> ', user);
    const userName = user.name;
    const userId = user.id;

    this.socketService.connectToChat(userId, userName, id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
