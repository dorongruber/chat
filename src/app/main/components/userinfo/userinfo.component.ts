import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ControllerService } from 'src/app/services/base/controller.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { ImageSnippet } from '../../models/imagesnippet.model';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnChanges {
  @Input() inputUser: User | undefined;
  userForm: UntypedFormGroup = new UntypedFormGroup({});
  user: User = new User('','','','','',new File([],'emptyFile'));
  isLoading = false;
  selectedFile: ImageSnippet | undefined;
  sf = false;
  imgToShow: any;
  constructor(
    private userService: UserService,
    private controllerService: ControllerService,
    private sanitizer: DomSanitizer,
  ) { }

  async ngOnChanges() {
    if (this.inputUser) {
      this.onLoadingChange(this.isLoading);
      this.user = this.inputUser;
      if(Object.keys(this.user.img).includes('data')) {
        this.imgToShow = (this.user.img as any).data;
        this.selectedFile = new ImageSnippet(
          new File([(this.user.img as any).data],
         (this.user.img as any).filename)
        )
      }
    } else
      this.onLoadingChange(this.isLoading);

    this.initForm();

  }

  initForm(){
    this.userForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.user.name, Validators.required),
      email: new UntypedFormControl(this.user.email, Validators.required),
      phone: new UntypedFormControl(this.user.phone, Validators.required),
      image: new UntypedFormControl(null)
    })
  }

  onSubmit(form: UntypedFormGroup) {
    if (!form.valid && this.selectedFile) return;
    this.onLoadingChange(this.isLoading);
    let name = form.value.name;
    let email = form.value.email;
    let phone = form.value.phone;
    let img =  this.selectedFile?.file ? this.selectedFile.file : new File([],'emptyFile');

    const updatedUser = new User(this.user.id,name,phone,this.user.password,email,img);
    this.userService.set(updatedUser);
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
      reader.addEventListener('load', (event: any) => {
        if (file) {
          const newfile = new File([file], file.name);
          this.selectedFile = new ImageSnippet(newfile);
          this.sf = !this.sf;
        } else {
          const emptyFile = new File([], 'emptyfile');
          this.selectedFile = new ImageSnippet(emptyFile);
          this.sf = false;
        }
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
