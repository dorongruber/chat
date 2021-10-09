import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeviceTypeService } from './services/devicetype.service';
import { RouterService } from './services/router.service';

const ROUTE_TO_CHECK = '/main/chats/'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  subscription = new Subscription();
  title = 'chat';
  isChatOpen = false;
  constructor(
    private routerService: RouterService,
    private deviceTypeService: DeviceTypeService
  ) {
    console.log('device type -> ', this.deviceTypeService.isMobile);
    this.subscription = this.routerService.onRouteChange.subscribe(url => {
      this.checkRoute(url);
      console.log('app after check ->', this.isChatOpen);
    })
  }

  checkRoute(url: string) {
    const checkIfNum = Number(url.slice(-1));
    const relatedToRoute = url.slice(0,-1);

    if (typeof checkIfNum === 'number' && !isNaN(checkIfNum) && relatedToRoute === ROUTE_TO_CHECK) {
      this.isChatOpen = true;
    } else
      this.isChatOpen = false;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
