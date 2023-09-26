import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControllerService } from 'src/app/services/base/controller.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil, take, map } from "rxjs/operators";
import { DeviceTypeService } from 'src/app/services/devicetype.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnChanges {
  selectedMenuOption: number = 0;
  option = 3;
  title = "Landing page";
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
    .pipe(takeUntil(this.subscriptionContolService.stop$), take(1), map(obj => {
      if(this.deviceTypeService.isMobile) {
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

  ngOnChanges(): void {
     setTimeout(() => {
       this.selectedMenuOption = this.option;
     },1000)
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
      this.option = obj.option? obj.option: 3;
    } else {
      this.option = obj.option !== undefined? obj.option: 3;
    }
  }

  descktopMenuControl(obj: {state: boolean, option: number}) {
      setTimeout(() => {
        this.option = obj.option ? obj.option: 3;
      });
  }
}
