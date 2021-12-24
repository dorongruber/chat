import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../services/chats.service';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';
import { User } from 'src/app/shared/models/user';
import { DeviceTypeService } from '../services/devicetype.service';
import { ControllerService } from '../services/base/controller.service';
import { Subscription } from 'rxjs';

const COMPONENT_BASE_ROUTE = '/main';
const ids = ['doron123', 'bar876'];
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})
export class MainComponent implements OnInit {
  title = "chats list page"
  baseRoute = COMPONENT_BASE_ROUTE;
  user: User | undefined;
  isMobile = false;
  isMenuOpen = false;
  menuOption = 3;
  subscription = new Subscription();
  private subscriptions = new Subscription();
  constructor(
    private userService: UserService,
    private socketService: SocketService,
    private chatService: ChatsService,
    private deviceTypeService: DeviceTypeService,
    private controllerService: ControllerService,
  ) { }

  async ngOnInit(): Promise<void> {
    const index = Math.floor(Math.random() * 2);
    const id = ids[index];
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
          this.menuOption = obj.option;
        else {
          setTimeout(() => {
            this.menuOption = obj.option;
          }, 1000);
        }
      })

  }

}
