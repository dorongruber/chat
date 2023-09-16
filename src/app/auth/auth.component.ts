import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loadState = true;
  isLoading = false;
  direction = false;
  stop$ = new Subject<void>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {

    if (window.innerWidth <= 640)
      this.direction = true;
  }

  ngOnInit() {
    this.authService.loadingObs.pipe(takeUntil(this.stop$)).subscribe((state: boolean) =>  {
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

  stop() {
    this.stop$.next();
    this.stop$.complete();
  }

}
