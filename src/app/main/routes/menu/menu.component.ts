import { Component, OnInit, ViewChild } from '@angular/core';
import { ControllerService } from 'src/app/services/base/controller.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { MatSidenav } from '@angular/material/sidenav';
import { mainMenuOptions, menuExtraOptions } from 'src/app/main/consts/menuoptionslists';
import { takeUntil, tap } from 'rxjs/operators';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { Header1Component } from '../../components/headers/header1/header1.component';
import { HeaderMenuOption } from '../../models/header-menu-option';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ControllerService],
})
export class MenuComponent implements OnInit {
  @ViewChild("menuSideNav") sidenav!: MatSidenav;

  title = "Landing page";
  menuOptions:  HeaderMenuOption[];
  extraOptions: HeaderMenuOption[];
  headerComponentRef: DynamicComponentRef ;
  sidenavComponentRef?: DynamicComponentRef;
  constructor(
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
    ) {
      this.menuOptions = mainMenuOptions;
      this.extraOptions = menuExtraOptions;
      this.headerComponentRef = new DynamicComponentRef(Header1Component);
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
