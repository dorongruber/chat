import { Component, OnInit, ViewChild } from '@angular/core';
import { ControllerService } from 'src/app/services/base/controller.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { MatSidenav } from '@angular/material/sidenav';
import { mainMenuOptions } from 'src/app/mockData/menuoptionslists';
import { takeUntil, tap } from 'rxjs/operators';

const COMPONENT_BASE_ROUTE = '/main';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ControllerService],
})
export class MenuComponent implements OnInit {
  @ViewChild("menuSideNav") sidenav!: MatSidenav;
  option: string = '';
  title = "Landing page";
  baseRoute = COMPONENT_BASE_ROUTE;
  menuOptions = mainMenuOptions;
  type =  "MenuComponent";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
    private deviceTypeService: DeviceTypeService,
    ) {
      this.controllerService.onMenuStateChange
      .pipe(takeUntil(this.subscriptionContolService.stop$), tap((res) => {
        console.log("res===> ", res);
        
        this.option = res?.split('/')[2];
        this.sidenav.toggle();
      }))
      .subscribe();
    }

  ngOnInit(): void {
  }

}
