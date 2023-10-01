import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControllerService } from 'src/app/services/base/controller.service';
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { RouterService } from 'src/app/services/router.service';

import {chatMenuOptions, mainMenuOptions} from '../../../mockData/menuoptionslists';
import { ChatInMenu } from '../../models/chat';

const ROUTE_TO_SHOW_BUTTON = '/main/chat';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isChatOpen = false;
  isMobile = false;
  menuOptions: any[] = [];
  @Input() title: string = '';
  @Input() relatedToRoute = '';
  @Input() chat: ChatInMenu = new ChatInMenu('','',new File([],'emptyFile'));
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private routerService: RouterService,
    private deviceTypeService: DeviceTypeService,
    private controllerService: ControllerService,
  ) { }

  ngOnInit(): void {

    this.checkRoute(this.router.url);
    this.routerService.onRouteChange.subscribe(currentURL => {
      this.checkRoute(currentURL);
    })
    this.isMobile = this.deviceTypeService.isMobile;
    if (this.isChatOpen)
      this.menuOptions = chatMenuOptions;
    else
      this.menuOptions = mainMenuOptions;
  }

  checkRoute(url: string) {
    const checkIfNum = Number(url.slice(-1));

    if (typeof checkIfNum === 'number' && !isNaN(checkIfNum) && this.relatedToRoute === ROUTE_TO_SHOW_BUTTON) {
      this.isChatOpen = true;
    }
  }

  onMenuChange(optionIndex: number) {
    if (this.isChatOpen)
      this.chatMenuOptions(optionIndex);
    else
      this.mainMenuOptions(optionIndex);

  }

  mainMenuOptions(index: number) {
    switch(index) {
      case 0:
        if (this.isMobile)
          this.controllerService.onStateChange(undefined);
        this.onNavigationChange('./newchat');
        break;
      case 1:
        this.controllerService.onStateChange(index);
        break;
      case 2:
        this.controllerService.onStateChange(index);
        break;
      case 3:
        this.controllerService.onStateChange(index);
        break;
      case 4:
        localStorage.removeItem('userData');
        this.router.navigate(['auth']);
        break;
      default:
        this.controllerService.onStateChange(undefined);
        break;
    }
  }

  chatMenuOptions(index: number) {
    switch(index) {
      case 0:
        this.onNavigationChange(`/main/newchat/${this.chat.id}`);
        break;
      case 1:
        this.OnBackClick();
        break;
      default:
        this.controllerService.onStateChange(undefined);
        break;
    }
  }

  onNavigationChange(path: string) {
    this.router.navigate([path], {relativeTo: this.route.parent});
  }

  OnBackClick() {
    this.router.navigate(['/main'], {relativeTo: this.route});
  }

}
