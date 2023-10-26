import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { AuthService } from 'src/app/services/auth.service';
import { AuthResponseData } from '../../models/auth-response';
import { BaseUser } from '../../models/newuser';
import { CustomBasicControl } from '../../../shared/models/form-field';
import { loginFormStructure } from '../../consts/auth-forms-controls';
import { FormControlService } from '../../../services/form-control.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoading = false;
  authForm: FormGroup;
  loginFormFields: CustomBasicControl[];
  error: string | null;

  constructor(
    private authService: AuthService,
    private controlService: FormControlService,
    private subscriptionContolService: SubscriptionContolService,
    private router: Router,
    private route: ActivatedRoute
  ) {
     this.error = null;
     this.loginFormFields = this.controlService.GetFlattedList(loginFormStructure);
     this.authForm = this.controlService.InstantiateForm(loginFormStructure);
   }

  onSubmit(form: FormGroup) {
    if(form.invalid) {
      return;
    }
    // submit form
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;
    const isUser = new BaseUser(form.value.email, form.value.password)

    authObs = this.authService.onLogin(isUser).pipe(takeUntil(this.subscriptionContolService.stop$));

    authObs.subscribe((resData) => {
      console.log(`auth obs next ==> ${resData}`);
      
      this.error = null;
    }, (errMsg) => {
      this.authService.loadingObs.next(false);
      this.isLoading = false;
      this.error = errMsg;
    }, () =>{
      this.authService.loadingObs.next(this.isLoading);
      this.router.navigate(['../../main'], { relativeTo: this.route});
    });
    form.reset();
  }

}
