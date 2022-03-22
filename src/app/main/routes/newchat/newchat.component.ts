import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { RouterAnimations } from 'src/app/app.animation';
import { ChatService } from 'src/app/services/chat.service';
import { ChatsService } from 'src/app/services/chats.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { Chat } from '../../models/chat';
import { ImageSnippet } from '../../models/imagesnippet.model';

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
  chatForm: FormGroup = new FormGroup({});
  error: string | null = null;
  selectedFile: ImageSnippet | undefined = undefined;
  sf = false;
  temp: any;
  imgToShow: any = null;
  chatName = '';
  filteredOptions: Observable<User[]>[] = [];
  currentUser: any;
  allUsers: User[] = [];
  formControlUserReset: User = new User('','','','','',new File([],'emptyFile'));

  chatId$: Observable<string>= new Observable<string>();
  chatId: string = '';
  chatusers: User[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private chatsService: ChatsService,
    private chatService: ChatService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
  ) {
    this.InitForm();
   }
  //TODO on page reload need to pass user ID
  ngOnInit() {
    this.currentUser = this.userService.get();

    this.chatId$ = this.route.paramMap.pipe(switchMap(params => {
      return params.getAll('id');
    }))
    this.chatId$.subscribe(async (res) => {
      this.chatId = res;
      const chat = (await this.chatService.getChatData(this.chatId) as Chat);
      this.chatName = chat.name;
      this.imgToShow = chat?.img ? (chat.img as any).data : null;
      this.chatusers = chat.users;
      this.InitEditForm();
    })
    // if (this.currentUser.name === '') {
    //   this.currentUser = this.userService.getUserById()
    // }
    this.setAutoOptions();
  }

  setAutoOptions() {
    this.userService.getAllUsers()
    .then(resData => {
      this.allUsers = [...resData.filter(u => u.id !== this.currentUser.id)];
      this.ManageNameControl(0);
    });
  }

  InitForm() {
    this.chatForm = new FormGroup({
      name: new FormControl(this.chatName, [Validators.required]),
      users: new FormArray([this.fb.group({
        user: new FormControl(null, Validators.required)
      })]),
      image: new FormControl(null)
    });
  }

  InitEditForm() {
    this.chatForm = new FormGroup({
      name: new FormControl(this.chatName, [Validators.required]),
      users: new FormArray([...this.chatusers.map(user => {
        return this.fb.group({
              user: new FormControl(user, Validators.required)
            })
      })]),
      image: new FormControl(null)
    });
  }

  get users() {
    return this.chatForm.get('users') as FormArray;
  }

  addUser() {
    let formGroup = this.fb.group({
      user: new FormControl(null, Validators.required)
    });
    this.users.push(formGroup);
    this.ManageNameControl(this.users.length - 1);
  }

  async removeUser(i: number) {
    this.users.setControl(i,this.fb.group({
      user: new FormControl(null, Validators.required)
    }));
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      console.log('invalide form -> ', form);
      return;
    }
    this.isLoading = true;
    let reqUsers: any[] = [];
    for(const formgroup of this.users.value) {
      reqUsers.push(formgroup.user);
    }
    reqUsers.push(this.currentUser)
    let name = form.value.name;
    let img =  this.selectedFile?.file ? this.selectedFile.file : new File([],'emptyFile');
    console.log('name,users,this.currentUser.id -> ', name,reqUsers,this.currentUser.id);
    this.chatsService.addChat(this.chatId,name,reqUsers,this.currentUser.id,img);
    form.reset();
    this.InitForm();
    this.isLoading = false;
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

  ManageNameControl(index: number) {
    if(this.users && this.users.length) {
      const options = this.users.at(index).get('user')?.valueChanges
      .pipe(
      startWith<User>(this.formControlUserReset),
      map(obj => obj),
      map(user => user && user.name ? this._filter(user.name) : this._filter(this.currentUser.name))
      );
      if(options) {
        this.filteredOptions[index] = options;
      }
    }
  }

  displayFn(user?: User): string {
    return user ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.allUsers.filter(user => user.name !== filterValue);
  }
}

