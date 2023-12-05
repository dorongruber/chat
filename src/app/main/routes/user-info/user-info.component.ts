import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControllerService } from 'src/app/services/base/controller.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
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
  form: FormGroup;
  user: User = new User('','','','','','',new File([],'emptyFile'));
  isLoading = false;
  selectedFile?: File;
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
    this.form = this.controlService.InstantiateForm(userFormStructure);
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
            console.log("errer User info Component", err); 
          }
        );
  }

  initForm(){
    this.form.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
    });
  }

  initImg(file: File) {
    this.selectedFile = file;
  }

  formFieldTrackBy(index: number,field: CustomBasicControl) {
    return field.properties["label"];
  }

  onLoadingChange(load: boolean) {
    this.isLoading = !load;
  }

  closeWindow() {
    this.controllerService.onStateChange(undefined);
  }

  onValueChange(fieldName: string) {
    const control = this.form.get(fieldName);
    
    if(control?.invalid) {
      alert(control?.errors);
      return;
    }
    if(this.form.invalid) {
      alert(this.form.errors);
      return;
    }
    if(!this.form.dirty || this.form.pristine) {
      return;
    }
    this.onLoadingChange(this.isLoading);
    let img =  this.selectedFile ? this.selectedFile : new File([],'emptyFile');
    const updatedUser = new User(this.user._id,this.user.id,this.form.value.name,this.form.value.phone,this.user.password,this.form.value.email,img);
    this.userService.updateUser(updatedUser);
    this.onLoadingChange(this.isLoading);
    
  }
}
