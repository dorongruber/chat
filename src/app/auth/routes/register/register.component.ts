import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterUser } from '../../models/newuser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  authForm: UntypedFormGroup = new UntypedFormGroup({});
  error: string | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.InitForm();
  }

  InitForm() {

    let userName = '';
    let userEmail = '';
    let userPhone = '';
    let userPassword = '';
    let userConfiremPassword = '';

    this.authForm = new UntypedFormGroup({
      name: new UntypedFormControl(userName, [Validators.required]),
      email: new UntypedFormControl(userEmail, [
        Validators.required,
        Validators.email]),
      phone: new UntypedFormControl(userPhone, [ Validators.required]),
      passform: new UntypedFormGroup({
        password: new UntypedFormControl(userPassword, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
          Validators.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})'))
        ]),
        confirmpassword: new UntypedFormControl(userConfiremPassword, [Validators.required])
      }, {validators: PassValidator})
    });
  }

  onSubmit(form: UntypedFormGroup) {

    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    let name = form.value.name;
    let email = form.value.email;
    let phone = form.value.phone;
    let password = form.value.passform.password;

    let authObs: Observable<{message: boolean}>;
    const newuser = new RegisterUser(email,password,name,name,phone);
    authObs = this.authService.onRegister(newuser);
    // add new user to db

    authObs.subscribe(resData => {
      if (resData) {
        this.isLoading = false;
        this.authService.loadingObs.next(this.isLoading);
        this.router.navigate(['../login'], {relativeTo: this.route});
      } else {
        this.isLoading = false;
        this.authService.loadingObs.next(this.isLoading);
      }
    });
    form.reset();
  }
}

export const PassValidator: ValidatorFn = (control:
  AbstractControl): ValidationErrors | null =>  {
    const pass = control.get('password');
    const confpass = control.get('confirmpassword');
    if (( pass?.value !== confpass?.value) && pass && confpass) {
      return {NotEqualPasswords: true};
    }
    return null;
  };
