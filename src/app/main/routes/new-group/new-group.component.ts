import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { Chat } from '../../models/chat';
import { ImageSnippet } from '../../models/imagesnippet.model';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { takeUntil } from "rxjs/operators";
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { Header2Component } from '../../components/headers/header2/header2.component';
import { ListItem } from '../../models/list-item';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class GroupchatComponent implements OnInit {
  isLoading = false;
  chatForm: FormGroup = new FormGroup({});
  error: string | null = null;
  selectedFile: ImageSnippet | undefined = undefined;
  imgToShow: any = null;
  chatName = '';
  filteredOptions: Observable<User[]>[] = [];
  currentUser!: User;
  formControlUserReset: User = new User('','','','','',new File([],'emptyFile'));

  chatId$: Observable<string>= new Observable<string>();
  chatId: string = '';
  chatusers: User[] = [];
  componentRef = new DynamicComponentRef(Header2Component);

  usersItemFormat: ListItem[] = [];
  usersById: {[key: string]: User} = {};
  listUsers: ListItem[] = [];
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chatsService: ChatsService,
    private chatService: ChatService,
    private fb: FormBuilder,
    private subscriptionContolService: SubscriptionContolService,
  ) {
    this.InitForm();
    this.userService.onUserChange
      .pipe(
        takeUntil(this.subscriptionContolService.stop$))
        .subscribe(
          (user: User) => {
            this.currentUser = user;
          },
          (err) => {
            console.log("errer NewchatComponent ==> ", err); 
          },
        );
   }
  //TODO on page reload need to pass user ID
  ngOnInit() {
    
    this.chatId$ = this.route.paramMap
    .pipe(switchMap(params => {
      return params.getAll('id');
    }))
    this.chatId$
    .pipe(takeUntil(this.subscriptionContolService.stop$), tap(async (res) => {
      this.chatId = res;
      const chat = (await this.chatService.getChatData(this.chatId) as Chat);
      this.chatName = chat.name;
      this.imgToShow = chat?.img ? (chat.img as any).data : null;
      this.chatusers = chat.users;
    }))
    .subscribe((res) => {
      this.InitEditForm();
    });
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

  InitForm() {
    this.chatForm = this.fb.group({
      name: this.fb.control(this.chatName, [Validators.required]),
      users: this.fb.array([], Validators.required),
      image: this.fb.control(null)
    });
  }

  InitEditForm() {
    this.chatForm = this.fb.group({
      name: this.fb.control(this.chatName, [Validators.required]),
      users: this.fb.array([this.chatusers.map(user => {
        return this.fb.control(user, Validators.required)
      })]),
      image: this.fb.control(null)
    });
  }

  get users() {
    return this.chatForm.get('users') as FormArray;
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
    let reqUsers: any[] = [];
    for(const control of this.users.value) {
      reqUsers.push(control.value);
    }
    reqUsers.push(this.currentUser)
    let name = form.value.name;
    let img =  this.selectedFile?.file ? this.selectedFile.file : new File([],'emptyFile');
    this.chatsService.addChat(this.chatId,name,reqUsers,this.currentUser.id,img, "group");
    form.reset();
    this.InitForm();
    this.isLoading = false;
  }

  userTrackBy(index: number,listItem: ListItem) {
    return listItem.id;
  }
}
