import { Component, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { Header2Component } from '../../components/headers/header2/header2.component';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItem } from '../../models/list-item';
import { User } from 'src/app/shared/models/user';
import { ImageSnippet } from '../../models/imagesnippet.model';
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
  selectedFile: ImageSnippet | undefined;
  componentRef = new DynamicComponentRef(Header2Component);

  customFormFields: CustomBasicControl[];
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
      for (let index = 0; index < this.chat.users.length; index++) {
        const user = this.chat.users[index];
        this.usersById[user.id] = user;
        const formatUser = new ListItem(user.id, user.name,user.phone,{_img: user.img, _icon: 'account_circle'});
        this.listUsers.push(formatUser);
        const newControl = this.fb.control<User>(user);
        this.users.push(newControl);
      }
      
    }))
    .subscribe(() => {
      this.onLoadingChange();
    });
  }

  get users() {
    return this.form.get('users') as FormArray;
  }

  initImg(file: ImageSnippet) {
    this.selectedFile = file;
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      console.log('invalide form -> ', form);
      return;
    }
    this.isLoading = true;
    console.log("update submited group chat ==> ", form);
    
    // let reqUsers: any[] = [];
    // for(const control of this.users.value) {
    //   reqUsers.push(control.value);
    // }
    // reqUsers.push(this.currentUser)
    // let name = form.value.name;
    // let img =  this.selectedFile?.file ? this.selectedFile.file : new File([],'emptyFile');
    // this.chatsService.addChat(this.chatId,name,reqUsers,this.currentUser.id,img);
    form.reset();
    // this.InitForm();
    this.isLoading = false;
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
