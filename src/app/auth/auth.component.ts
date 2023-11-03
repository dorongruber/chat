import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { AuthService } from '../services/auth.service';
import { SubscriptionContolService } from '../services/subscription-control.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loadState = true;
  isLoading = false;
  direction = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private subscriptionContolService: SubscriptionContolService,
  ) {
      this.direction = window.innerWidth <= 640;
  }

  ngOnInit() {
    this.authService.loadingObs.pipe(takeUntil(this.subscriptionContolService.stop$)).subscribe((state: boolean) =>  {
      this.isLoading = state;
    });
    this.router.navigate(['login'], {relativeTo: this.route});
  }

  onSelectForm() {

    if (this.loadState)
      this.router.navigate(['register'], {relativeTo: this.route});
     else
      this.router.navigate(['login'], {relativeTo: this.route});


    this.loadState = !this.loadState;
  }

}
