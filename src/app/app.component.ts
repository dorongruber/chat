import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { RouterService } from './services/router.service';

const ROUTE_TO_CHECK = '/main/chats/'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  title = 'chat';
  isChatOpen = false;

  constructor(
    private routerService: RouterService,
    private authService: AuthService,
  ) {
    this.subscription = this.routerService.onRouteChange.subscribe(url => {
      this.checkRoute(url);
    })
  }

  ngOnInit() {
    console.log('host url => ', window.location.host);

    this.authService.AutoLogin();
  }

  checkRoute(url: string) {
    const checkIfNum = Number(url.slice(-1));
    const relatedToRoute = url.slice(0,-1);
    if (typeof checkIfNum === 'number' && !isNaN(checkIfNum) && relatedToRoute === ROUTE_TO_CHECK)
      this.isChatOpen = true;
    else
      this.isChatOpen = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
