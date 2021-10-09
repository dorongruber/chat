import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RouterService implements OnDestroy {
  subscription = new Subscription();
  onRouteChange = new Subject<string>();
  private currentRoute = '';
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('last route => ', event.urlAfterRedirects);
        this.currentRoute = event.urlAfterRedirects;
        this.onRouteChange.next(this.currentRoute);
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
