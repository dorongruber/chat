import { Component, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { Header2Component } from '../../components/headers/header2/header2.component';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ListItem } from '../../models/list-item';
import { User } from 'src/app/shared/models/user';
import { CustomBasicControl } from 'src/app/shared/models/form-field';
import { FormControlService } from 'src/app/services/form-control.service';
import { chatFormStructure } from '../../consts/group-form';

@Component({
  selector: 'app-chat-info',
  templateUrl: './group-chat-info.component.html',
  styleUrls: ['./group-chat-info.component.scss']
})
export class ChatInfoComponent implements OnInit {
    
  isLoading: boolean = false;
  chat: any;
  form: FormGroup;  
  usersById: {[key: string]: User} = {};
  usersItemFormat: ListItem[] = [];
  listUsers: ListItem[] = [];
  selectedFile?: File;
  componentRef = new DynamicComponentRef(Header2Component);

  customFormFields: CustomBasicControl[];
  isReadOnly: boolean = true;
  constructor(
    private controlService: FormControlService,
    private fb: FormBuilder,
    private chatService: ChatService,
    private subscriptionContolService: SubscriptionContolService,
  ) {
    this.customFormFields = this.controlService.GetFlattedList(chatFormStructure);
    this.form = this.controlService.InstantiateForm(chatFormStructure);
  }

  ngOnInit(): void {
    this.chatService.getCurrentChat()
    .pipe(takeUntil(this.subscriptionContolService.stop$), tap(async res => {
      this.onLoadingChange();
      this.chat = res;
      this.isReadOnly = this.chat.type == 'group' ? false : true;
      this.initForm();
      if(this.chat.type == 'group') {
        this.initUsersList();
      }
      
    }))
    .subscribe(() => {
      this.onLoadingChange();
    });
  }

  initForm() {
    this.form.patchValue({
      name: this.chat.name,
      image: this.chat.image
    })
  }

  initUsersList() {
    for (let index = 0; index < this.chat.users.length; index++) {
      const user = this.chat.users[index];
      this.usersById[user.id] = user;
      const formatUser = new ListItem(user.id, user.name,user.phone,{_img: user.img, _icon: 'account_circle'});
      this.listUsers.push(formatUser);
      const newControl = this.fb.control<User>(user);
      this.users.push(newControl);
    }
  }

  get users() {
    return this.form.get('users') as FormArray;
  }

  async initImg(file: File) {
    this.selectedFile = file;
    this.chat.image = this.selectedFile;
    await this.chatService.newChat(this.chat.id, this.chat.name, this.chat.users,this.chat.image,this.chat.type);
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
    this.onLoadingChange();
    let img =  this.selectedFile ? this.selectedFile : new File([],'emptyFile');
    // const updatedUser = new User(this.user.id,this.form.value.name,this.form.value.phone,this.user.password,this.form.value.email,img);
    // this.chatService.(updatedUser);
    this.onLoadingChange();
    
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

  onLoadingChange() {
    this.isLoading = !this.isLoading;
  }
}
