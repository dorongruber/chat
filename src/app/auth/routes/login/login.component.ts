import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthResponseData } from '../../models/auth-response';
import { BaseUser } from '../../models/newuser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;

  authForm: FormGroup = new FormGroup({});
  error: string | null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
     this.error = null;
   }

  ngOnInit() {
    this.InitForm();
  }

  InitForm() {

    this.authForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})'))
      ])
    });
  }
  onSubmit(form: FormGroup) {
    // submit form
    console.log('auth form -> ', this.authForm);
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;
    const isUser = new BaseUser(form.value.email, form.value.password)
    authObs = this.authService.onLogin(isUser);

    authObs.subscribe(resData => {
      // console.log('resData -> ', resData);

      this.error = null;
      this.router.navigate(['../../main'], { relativeTo: this.route});

      this.authService.loadingObs.next(this.isLoading);

      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }, errorMessage => {
      // this.isLoading = false;
      console.log(errorMessage);

      // console.log('error -> ', this.error);
      this.authService.loadingObs.next(false);
      this.error = errorMessage;
      setTimeout(() => {
        this.isLoading = false;
      }, 0);
    });
    form.reset();
  }

}
