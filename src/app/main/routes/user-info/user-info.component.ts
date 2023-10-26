import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControllerService } from 'src/app/services/base/controller.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { ImageSnippet } from '../../models/imagesnippet.model';
import { takeUntil, tap } from "rxjs/operators";
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { Header2Component } from '../../components/headers/header2/header2.component';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { CustomBasicControl } from 'src/app/shared/models/form-field';
import { FormControlService } from 'src/app/services/form-control.service';
import { userFormStructure } from '../../consts/user-form';

@Component({
  selector: 'app-userinfo',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserinfoComponent {
  userForm: FormGroup;
  user: User = new User('','','','','',new File([],'emptyFile'));
  isLoading = false;
  selectedFile: ImageSnippet | undefined;
  imgToShow: any;
  componentRef = new DynamicComponentRef(Header2Component);
  customFormFields: CustomBasicControl[];
  constructor(
    private controlService: FormControlService,
    private userService: UserService,
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
  ) { 

    this.customFormFields = this.controlService.GetFlattedList(userFormStructure);
    this.userForm = this.controlService.InstantiateForm(userFormStructure);
    this.userService.onUserChange
      .pipe(
        takeUntil(this.subscriptionContolService.stop$), tap((user: User) => {
          this.onLoadingChange(this.isLoading);
          this.user = user;
          this.initForm();
        }))
        .subscribe(
          (user: User) => {
            this.onLoadingChange(this.isLoading)
          },
          (err) => {
            console.log("errer UserinfoComponent ==> ", err); 
          }
        );
  }

  initForm(){
    this.userForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
    });
  }

  initImg(file: ImageSnippet) {
    this.selectedFile = file;
  }

  onSubmit(form: FormGroup) {
    if (!form.valid && this.selectedFile) return;
    this.onLoadingChange(this.isLoading);
    let name = form.value.name;
    let email = form.value.email;
    let phone = form.value.phone;
    let img =  this.selectedFile?.file ? this.selectedFile.file : new File([],'emptyFile');

    const updatedUser = new User(this.user.id,name,phone,this.user.password,email,img);
    this.userService.updateUser(updatedUser);
    this.onLoadingChange(this.isLoading);
  }

  onLoadingChange(load: boolean) {
    this.isLoading = !load;
  }

  closeWindow() {
    this.controllerService.onStateChange(undefined);
  }
}
