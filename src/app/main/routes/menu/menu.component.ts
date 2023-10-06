import { Component, OnInit, ViewChild } from '@angular/core';
import { ControllerService } from 'src/app/services/base/controller.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceTypeService } from 'src/app/services/devicetype.service';
import { MatSidenav } from '@angular/material/sidenav';
import { mainMenuOptions } from 'src/app/main/consts/menuoptionslists';
import { takeUntil, tap } from 'rxjs/operators';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { Header1Component } from '../../components/headers/header1/header1.component';

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
  headerComponentRef = new DynamicComponentRef(Header1Component);
  sidenavComponentRef?: DynamicComponentRef;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
    ) {
      this.controllerService.onMenuStateChange
      .pipe(takeUntil(this.subscriptionContolService.stop$), tap((res) => {        
        this.sidenavComponentRef = res?.componentRef;
        this.sidenav.toggle();
      }))
      .subscribe();
    }

  ngOnInit(): void {
  }

}
