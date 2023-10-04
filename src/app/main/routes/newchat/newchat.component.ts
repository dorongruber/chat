import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { RouterAnimations } from 'src/app/app.animation';
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

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.scss'],
  animations: [
    RouterAnimations.routeSlide
  ]
})
export class NewchatComponent implements OnInit {
  isLoading = false;
  chatForm!: FormGroup;
  error: string | null = null;
  selectedFile: ImageSnippet | undefined = undefined;
  imgToShow: any = null;
  chatName = '';
  filteredOptions: Observable<User[]>[] = [];
  currentUser!: User;
  allUsers: User[] = [];
  formControlUserReset: User = new User('','','','','',new File([],'emptyFile'));

  chatId$: Observable<string>= new Observable<string>();
  chatId: string = '';
  chatusers: User[] = [];
  componentRef = new DynamicComponentRef(Header2Component);
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private chatsService: ChatsService,
    private chatService: ChatService,
    private sanitizer: DomSanitizer,
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
    .then(resData => {
      this.allUsers = [...resData.filter(u => u.id !== this.currentUser.id)];
    });
  }

  onSelectedChange(isSelected: boolean, user: User) {
    if(isSelected) {
      const newControl = this.fb.control<User>(user);
      this.users.push(newControl);     
    } else {
      let index = this.users.controls.findIndex(u => u.value == user);
      this.users.removeAt(index);
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
    this.chatsService.addChat(this.chatId,name,reqUsers,this.currentUser.id,img);
    form.reset();
    this.InitForm();
    this.isLoading = false;
  }

  ProcessFile(imageInput: any) {
    const file: File = imageInput.target.files[0];
    if (file) {
      const reader = new FileReader();
      fromEvent(reader, 'load')
      .pipe(takeUntil(this.subscriptionContolService.stop$), tap((event: any) => {
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

  displayFn(user?: User): string {
    return user ? user.name : '';
  }
}

