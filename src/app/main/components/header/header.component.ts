import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControllerService } from 'src/app/services/base/controller.service';
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { RouterService } from 'src/app/services/router.service';

import {chatMenuOptions, mainMenuOptions} from '../../../mockData/menuoptionslists';

const ROUTE_TO_SHOW_BUTTON = '/main/chats/chat';

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
    console.log('check res => ', this.isChatOpen);
    if (this.isChatOpen)
      this.menuOptions = chatMenuOptions;
    else
      this.menuOptions = mainMenuOptions;
  }

  checkRoute(url: string) {
    const checkIfNum = Number(url.slice(-1));
    console.log('last route -> ', url.slice(-1), checkIfNum,this.relatedToRoute);

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
        //this.onNavigationChange('./chats');
        break;
      default:
        this.controllerService.onStateChange(undefined);
        break;
    }
  }

  chatMenuOptions(index: number) {
    switch(index) {
      case 3:
        this.OnBackClick();
        break;
      default:
        this.controllerService.onStateChange(undefined);
        break;
    }
  }

  onNavigationChange(path: string) {
    this.router.navigate([path], {relativeTo: this.route});
  }

  OnBackClick() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
