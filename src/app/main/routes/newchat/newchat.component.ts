import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RouterAnimations } from 'src/app/app.animation';
import { ChatsService } from 'src/app/services/chats.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
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
  OptionUsers: User[] = [];
  isLoading = false;
  chatForm: FormGroup = new FormGroup({});
  error: string | null = null;
  // selectedFile: ImageSnippet;
  // sf = false;
  // temp: any;
  chatName = '';
  UsersToAddToChat: User[] = [];
  currentUser: any;
  allUsers: User[] = [];
  formControlUserReset: User = new User('','','','','');
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private chatsService: ChatsService,
    private sanitizer: DomSanitizer,
  ) {
    this.InitForm();
   }

  ngOnInit() {
    this.currentUser = this.userService.get();
    this.setAutoOptions();

  }

  setAutoOptions() {

    this.userService.getAllUsers()
    .then(resData => {
      console.log('current user -> ', this.currentUser);
      console.log('resData -> ', resData);
      this.allUsers = [...resData.filter(u => u.id !== this.currentUser.id)];
      this.OptionUsers = [...this.allUsers];
    });
    console.log('this.OptionUsers -> ', this.OptionUsers);
  }

  InitForm() {
    this.chatName = '';
    this.chatForm = new FormGroup({
      name: new FormControl(this.chatName, [Validators.required]),
      users: new FormArray([new FormControl(this.formControlUserReset, Validators.required)]),
    });
  }

  get users() {
    return this.chatForm.get('users') as FormArray;
  }

  addUser() {
    this.users.push(new FormControl(this.formControlUserReset, Validators.required));
  }

  async removeUser(i: number) {
    const userToRemove = this.users.value[i];
    this.UsersToAddToChat = this.UsersToAddToChat.filter( u => u.id !== userToRemove.id);
    await this.updateUserOptions(userToRemove);
    this.users.setControl(i,new FormControl(this.formControlUserReset, Validators.required));
    this.addUser();
  }

  async updateUserOptions(user: User) {
    if (user)
      this.OptionUsers.push(user);
  }

  filterSelectedUsers(id: string) {
    this.OptionUsers = this.allUsers
    .filter(userOption => userOption.id !== id);
  }

  selectOption(index: number) {
    this.UsersToAddToChat.push(this.OptionUsers[index]);
    this.filterSelectedUsers(this.OptionUsers[index].id);
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      console.log('invalide form -> ', form);
      return;
    }
    this.isLoading = true;
    console.log('register form -> ', form, this.UsersToAddToChat);
    let name = form.value.name;
    let users = [...this.UsersToAddToChat,this.currentUser];

    this.chatsService.addChat(name,users,this.currentUser.id);
    // const newuser = new RegisterUser(Img,password,name,name,phone);
    // authObs = this.authService.onRegister(newuser);
    // console.log('autb observable -> ', authObs);
    // // add new user to db

    // authObs.subscribe(resData => {
    //   if (resData) {
    //     this.isLoading = false;
    //     this.authService.loadingObs.next(this.isLoading);
    //     this.router.navigate(['../login'], {relativeTo: this.route});
    //   } else {
    //     this.isLoading = false;
    //     this.authService.loadingObs.next(this.isLoading);
    //   }
    // });
    form.reset();
    this.InitForm();
    this.isLoading = false;
  }

  // ProcessFile(imgInput: any) {
  //   const file: File = imgInput.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.addEventListener('load', (event: any) => {
  //       if (file) {
  //         this.ng2ImgMax.resizeImage(file, 200, 150)
  //         .subscribe(result => {
  //           const newfile = new File([result], result.name);
  //           this.selectedFile = new ImageSnippet(newfile);
  //           this.sf = !this.sf;
  //         },
  //         error => {
  //           console.log('error => ', error);
  //         });
  //       } else {
  //         console.log('jhasbfabsdofibasdbfasd');
  //         const emptyFile = new File([], 'emptyfile');
  //         this.selectedFile = new ImageSnippet(emptyFile);
  //         this.sf = false
  //       }
  //       this.temp = event.target.result;
  //     });
  //     reader.readAsDataURL(file);
  //   }
  // }

  // Transform() {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(this.temp);
  // }
}

