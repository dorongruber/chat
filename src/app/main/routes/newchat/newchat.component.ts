import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterAnimations } from 'src/app/app.animation';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user';
import { SubscriptionContolService } from 'src/app/services/subscription-control.service';
import { takeUntil } from "rxjs/operators";
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { Header2Component } from '../../components/headers/header2/header2.component';
import { ListItem } from '../../models/list-item';
import { ChatsService } from 'src/app/services/chats.service';
import { ControllerService } from 'src/app/services/base/controller.service';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.scss'],
  animations: [
    RouterAnimations.routeSlide
  ]
})
export class NewchatComponent implements OnInit {

  currentUser!: User;
  userItemFormat: ListItem[] = [];
  users: {[key: string]: User} = {};

  componentRef = new DynamicComponentRef(Header2Component);
  newGroup: ListItem = new ListItem('','new group chat','',{_icon: 'supervised_user_circle'});
  constructor(
    private route: ActivatedRoute,
    private chatsService: ChatsService,
    private userService: UserService,
    private controllerService: ControllerService,
    private subscriptionContolService: SubscriptionContolService,
  ) {
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
    this.setAutoOptions();
  }

  onSelectedOption(value: ListItem) {
    console.log("onSelectedOption ==> ", value);
  }

  onSelectedUser(selected: ListItem) {
    const selectedUser = this.users[selected.id];
    const res = this.chatsService.addChat('',selected.name,[selectedUser, this.currentUser],this.currentUser.id,selected.img);
    this.controllerService.onStateChange(undefined);
  }

  setAutoOptions() {
    this.userService.getAllUsers()
    .then(resData => resData.filter(u => u.id !== this.currentUser.id))
    .then(filteredData => {
      for(let user of filteredData) {
        const formatUser = new ListItem(user.id, user.name,user.phone,{_img: user.img, _icon: 'account_circle'});
        this.userItemFormat.push(formatUser);
        this.users[user.id] = user;
      }
    });
  }

}

