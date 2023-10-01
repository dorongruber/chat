import { Component, OnInit, ViewChild } from '@angular/core';
import { ControllerService } from 'src/app/services/base/controller.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil, map } from "rxjs/operators";
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { MatSidenav } from '@angular/material/sidenav';

const COMPONENT_BASE_ROUTE = '/main';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ControllerService],
})
export class MenuComponent implements OnInit {
  @ViewChild("menuSideNav") sidenav!: MatSidenav;
  option = 3;
  title = "Landing page";
  baseRoute = COMPONENT_BASE_ROUTE;
  constructor(
    private router: Router,
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
    private deviceTypeService: DeviceTypeService,
    ) {
      this.option = this.deviceTypeService.isMobile? 0 : 3;
    }

  ngOnInit(): void {

    this.controllerService.onMenuStateChange
    .pipe(takeUntil(this.subscriptionContolService.stop$), map(obj => {    
      this.sidenav.toggle();  
        this.setHeaderTitleOnMobile(obj.option);
        this.menuControl(obj);
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



  menuControl(obj: {state: boolean, option: number}) {
      setTimeout(() => {
        this.option = obj.option ? obj.option: 3;
      });
  }
}
