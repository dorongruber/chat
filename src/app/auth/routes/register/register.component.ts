import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  authForm: FormGroup = new FormGroup({});
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

    this.authForm = new FormGroup({
      name: new FormControl(userName, [Validators.required]),
      email: new FormControl(userEmail, [
        Validators.required,
        Validators.email]),
      phone: new FormControl(userPhone, [ Validators.required]),
      passform: new FormGroup({
        password: new FormControl(userPassword, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
          Validators.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,12})'))
        ]),
        confirmpassword: new FormControl(userConfiremPassword, [Validators.required])
      }, {validators: PassValidator})
    });
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      console.log('invalide form -> ', form);
    }
    this.isLoading = true;
    console.log('register form -> ', form);
    let name = form.value.name;
    let email = form.value.email;
    let phone = form.value.phone;
    let password = form.value.passform.password;

    let authObs: Observable<{message: boolean}>;
    const newuser = new RegisterUser(email,password,name,name,phone);
    authObs = this.authService.onRegister(newuser);
    console.log('autb observable -> ', authObs);
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
    //console.log('custom validator -> ', pass?.value, confpass?.value);
    if (( pass?.value !== confpass?.value) && pass && confpass) {
      return {NotEqualPasswords: true};
    }
    return null;
  };
