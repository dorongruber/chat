import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatsService } from 'src/app/services/chats.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { ImageSnippet } from '../../models/imagesnippet.model';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.scss']
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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private chatsService: ChatsService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
   this.currentUser = this.userService.get();
    this.setAutoOptions();
    this.InitForm();
  }

  setAutoOptions() {

    this.userService.getAllUsers()
    .then(resData => {
      console.log('current user -> ', this.currentUser);
      console.log('resData -> ', resData);
      this.OptionUsers = [...resData.filter(u => u.id !== this.currentUser.id)];
    });
    console.log('this.OptionUsers -> ', this.OptionUsers);
  }
  //TODO add multe users to chat
  InitForm() {


    let chatImg = '';
    let chatUsers: User = new User('','','','','');
    let chatPassword = '';
    let chatConfiremPassword = '';

    this.chatForm = new FormGroup({
      name: new FormControl(this.chatName, [Validators.required]),
      users: new FormArray([new FormControl(chatUsers, Validators.required)]),
    });

    console.log('init this.chatForm => ', this.chatForm);
  }

  get users() {
    //console.log('get users => ', this.chatForm.get('users') as FormArray);
    return this.chatForm.get('users') as FormArray;
  }

  addUser() {
    let chatUsers: User = new User('','','','','');
    this.users.push(new FormControl(chatUsers, Validators.required));
  }

  removeUser(i: number) {
    this.UsersToAddToChat = this.UsersToAddToChat.filter( u => u.id !== this.users.value[i].id);
    this.users.removeAt(i);
  }

  selectOption(index: number) {
    this.UsersToAddToChat.push(this.OptionUsers[index]);
  }

  onSubmit(form: FormGroup) {

    if (!form.valid) {
      console.log('invalide form -> ', form);
    }
    this.isLoading = true;
    console.log('register form -> ', form, this.UsersToAddToChat);
    let name = form.value.name;
    let users = [...this.UsersToAddToChat];

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

    //form.reset();
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

