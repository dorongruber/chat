import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
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

  authForm: UntypedFormGroup = new UntypedFormGroup({});
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

    this.authForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})'))
      ])
    });
  }
  onSubmit(form: UntypedFormGroup) {
    // submit form
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;
    const isUser = new BaseUser(form.value.email, form.value.password)
    authObs = this.authService.onLogin(isUser);

    authObs.subscribe(resData => {
      this.error = null;
      this.router.navigate(['../../main'], { relativeTo: this.route});

      this.authService.loadingObs.next(this.isLoading);

      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }, errorMessage => {

      this.authService.loadingObs.next(false);
      this.error = errorMessage;
      setTimeout(() => {
        this.isLoading = false;
      }, 0);
    });
    form.reset();
  }

}
