import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterUser } from '../../models/newuser';
import { CustomBasicControl } from '../../../shared/models/form-field';
import { registrationFormStracture,  } from '../../consts/auth-forms-controls';
import { FormControlService } from '../../../services/form-control.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  isLoading = false;
  authForm: FormGroup;
  error: string | null = null;
  registrationFormFieldsStracture: CustomBasicControl[];

  constructor(
    private authService: AuthService,
    private controlService: FormControlService,
    private subscriptionContolService: SubscriptionContolService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registrationFormFieldsStracture = this.controlService.GetFlattedList(registrationFormStracture);
    this.authForm = this.controlService.InstantiateForm(registrationFormStracture);
  }

  onSubmit(form: FormGroup) {

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
    authObs = this.authService.onRegister(newuser).pipe(takeUntil(this.subscriptionContolService.stop$));
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


