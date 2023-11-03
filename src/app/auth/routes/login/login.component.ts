import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from "rxjs/operators";
import { AuthService } from 'src/app/services/auth.service';
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
    this.authService.loadingObs.next(true);
    const isUser = new BaseUser(form.value.email, form.value.password)

    this.authService.onLogin(isUser)
    .pipe(takeUntil(this.subscriptionContolService.stop$))
    .subscribe((resData) => {      
      this.error = null;
    }, (errMsg) => {
      this.authService.loadingObs.next(false);
      this.error = errMsg;
      form.reset();
    }, () =>{
      form.reset();
      this.router.navigate(['../../main'], { relativeTo: this.route});
      this.authService.loadingObs.next(false);
    });
    
  }

}
