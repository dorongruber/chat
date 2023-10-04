import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ControllerService } from 'src/app/services/base/controller.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { ImageSnippet } from '../../models/imagesnippet.model';
import { takeUntil, tap } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { Header2Component } from '../headers/header2/header2.component';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent {
  userForm: FormGroup = new FormGroup({});
  user: User = new User('','','','','',new File([],'emptyFile'));
  isLoading = false;
  selectedFile: ImageSnippet | undefined;
  imgToShow: any;
  componentRef = new DynamicComponentRef(Header2Component);
  constructor(
    private userService: UserService,
    private controllerService: ControllerService,
    private sanitizer: DomSanitizer,
    private subscriptionContolService: SubscriptionContolService,
  ) { 
    this.initForm();
    this.userService.onUserChange
      .pipe(
        takeUntil(this.subscriptionContolService.stop$), tap((user: User) => {
          this.onLoadingChange(this.isLoading);
          this.user = user;
          this.initImg();
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
    this.userForm = new FormGroup({
      name: new FormControl(this.user.name, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      phone: new FormControl(this.user.phone, Validators.required),
      image: new FormControl(null)
    })
  }

  initImg() {
    if(Object.keys(this.user.img).includes('data')) {
      this.imgToShow = (this.user.img as any).data;
      this.selectedFile = new ImageSnippet(
        new File([(this.user.img as any).data],
       (this.user.img as any).filename)
      )
    }
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

  ProcessFile(imageInput: any) {
    const file: File = imageInput.target.files[0];
    if (file) {
      const reader = new FileReader();
      fromEvent(reader, 'load')
      .pipe(takeUntil(this.subscriptionContolService.stop$), tap(() => {
        if (file) {
          const newfile = new File([file], file.name);
          this.selectedFile = new ImageSnippet(newfile);
        } else {
          const emptyFile = new File([], 'emptyfile');
          this.selectedFile = new ImageSnippet(emptyFile);
        }
      }))
      .subscribe((event: any) => {
        this.imgToShow = event.target.result;
      });
      reader.readAsDataURL(file);
    }
  }
  
  Transform() {
    const imgURL = this.imgToShow.includes('data:image/')? this.imgToShow : 'data:image/*;base64,' + this.imgToShow;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgURL);
  }
}
