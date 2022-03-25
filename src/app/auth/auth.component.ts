import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loadState = true;
  formStateSub = new Subscription;
  isLoading = false;
  direction = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {

    if (window.innerWidth <= 640)
      this.direction = true;
  }

  ngOnInit() {
    this.formStateSub = this.authService.loadingObs.subscribe((state: boolean) =>  {
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

  ngOnDestroy() {
    this.formStateSub.unsubscribe();
  }
}
