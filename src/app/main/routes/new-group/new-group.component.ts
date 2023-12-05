import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatsService } from 'src/app/services/chats.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { takeUntil } from "rxjs/operators";
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { Header2Component } from '../../components/headers/header2/header2.component';
import { ListItem } from '../../models/list-item';
import { CustomBasicControl } from 'src/app/shared/models/form-field';
import { FormControlService } from 'src/app/services/form-control.service';
import { chatFormStructure } from '../../consts/group-form';
import { ControllerService } from 'src/app/services/base/controller.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class GroupchatComponent implements OnInit {
  isLoading = false;
  error: string | null = null;
  selectedFile?: File;
  imgToShow: any = null;
  chatName = '';
  filteredOptions: Observable<User[]>[] = [];
  currentUser!: User;
  formControlUserReset: User = new User('','','','','','',new File([],'emptyFile'));

  chatId$: Observable<string>= new Observable<string>();
  chatId: string = '';
  chatusers: User[] = [];
  componentRef = new DynamicComponentRef(Header2Component);

  usersItemFormat: ListItem[] = [];
  usersById: {[key: string]: User} = {};
  listUsers: ListItem[] = [];

  chatForm: FormGroup;
  customFormFields: CustomBasicControl[];

  constructor(
    private controlService: FormControlService,
    private userService: UserService,
    private chatsService: ChatsService,
    private controllerService: ControllerService,
    private fb: FormBuilder,
    private subscriptionContolService: SubscriptionContolService,
  ) {
    this.customFormFields = this.controlService.GetFlattedList(chatFormStructure);
    this.chatForm = this.controlService.InstantiateForm(chatFormStructure);
    this.userService.onUserChange
      .pipe(
        takeUntil(this.subscriptionContolService.stop$))
        .subscribe(
          (user: User) => {
            this.currentUser = user;
          },
          (err) => {
            console.log("errer New group component", err); 
          },
        );
   }
  //TODO on page reload need to pass user ID
  ngOnInit() {
    this.setAutoOptions();
  }

  setAutoOptions() {
    this.userService.getAllUsers()
    .then(resData => resData.filter(u => u.id !== this.currentUser.id))
    .then(filteredData => {
      for (let i = 0; i < filteredData.length; i++) {
        const user = filteredData[i];
        const formatUser = new ListItem(user.id, user.name,user.phone,{_img: user.img, _icon: 'account_circle'});
        this.usersItemFormat.push(formatUser);
        this.usersById[user.id] = user;
      }
      this.listUsers = this.usersItemFormat;
    });
  }

  onSelectedUser(selected: ListItem) {
    const selectedUser = this.usersById[selected.id];
    let index = this.users.controls.findIndex(u => u.value == selectedUser);
    if(index > -1) {
      this.users.removeAt(index);
    } else {
      const newControl = this.fb.control<User>(selectedUser);
      this.users.push(newControl);
    }
  }

  get users() {
    return this.chatForm.get('users') as FormArray;
  }

  initImg(file: File) {
    this.selectedFile = file;
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      console.log('invalide form');
      return;
    }
    this.isLoading = true;
    let reqUsers: any[] = [];
    for(const control of this.users.value) {
      reqUsers.push(control);
    }
    reqUsers.push(this.currentUser);
    
    let name = form.value.name;
    let img =  this.selectedFile ? this.selectedFile : new File([],'emptyFile');
    this.chatsService.addChat(this.chatId,name,reqUsers,img, "group");
    form.reset();
    this.isLoading = false;
    this.controllerService.onStateChange(undefined);
  }

}
