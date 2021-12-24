import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ControllerService } from 'src/app/services/base/controller.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent implements OnInit {
  @Input() userId: string | undefined;
  userForm: FormGroup = new FormGroup({});
  user: User = new User('','','','','');
  isLoading = false;
  constructor(
    private userService: UserService,
    private controllerService: ControllerService,
  ) { }

  async ngOnInit() {
    if (this.userId) {
      this.onLoadingChange(this.isLoading);
      this.user = await this.userService.getUserById(this.userId);
      this.initForm();
    }
    this.onLoadingChange(this.isLoading);
  }

  initForm(){
    this.userForm = new FormGroup({
      name: new FormControl(this.user.name, Validators.required),
      email: new FormControl(this.user.email, Validators.required),
      phone: new FormControl(this.user.phone, Validators.required),
    })
  }

  onSubmit(form: FormGroup) {
    if (!form.valid) return;
    this.onLoadingChange(this.isLoading);
    let name = form.value.name;
    let email = form.value.email;
    let phone = form.value.phone;

    const updatedUser = new User(this.user.id,name,phone, this.user.password,email);

    this.userService.updateUser(updatedUser);
  }

  onLoadingChange(load: boolean) {
    this.isLoading = !load;
  }

  closeWindow() {
    this.controllerService.onStateChange(undefined);
  }
}
