import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthResponseData } from '../../models/auth-response';
import { BaseUser } from '../../models/newuser';
import { TestNode } from '../../models/form-field';
import { loginFormStructure } from '../../consts/auth-forms-controls';
import { AuthFormControlService } from '../../services/auth-forncontrol.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isLoading = false;
  authForm: FormGroup;
  loginFormFields: TestNode;
  error: string | null;
  constructor(
    private authService: AuthService,
    private authFormControlService: AuthFormControlService,
    private router: Router,
    private route: ActivatedRoute
  ) {
     this.error = null;
     console.log(`loginFormStructure childrens ==> ${loginFormStructure.GetChildrens().length}`);

     this.loginFormFields = loginFormStructure;
     this.authForm = this.authFormControlService.InstantiateForm(this.loginFormFields);
   }

  onSubmit(form: FormGroup) {
    if(form.invalid) {
      return;
    }
    // submit form
    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;
    const isUser = new BaseUser(form.value.email, form.value.password)
    authObs = this.authService.onLogin(isUser);

    authObs.subscribe(resData => {
      console.log(`res Data ==> ${resData}`);

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
