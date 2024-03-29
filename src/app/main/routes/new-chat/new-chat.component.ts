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
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
  animations: [
    RouterAnimations.routeSlide
  ]
})
export class NewchatComponent implements OnInit {

  currentUser!: User;
  usersItemFormat: ListItem[] = [];
  usersById: {[key: string]: User} = {};
  listUsers: ListItem[] = [];
  componentRef = new DynamicComponentRef(Header2Component);
  
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
            console.log("errer New chat Component", err); 
          },
        );
   }

  ngOnInit() {
    this.setAutoOptions();
  }

  onSelectedUser(selected: ListItem) {
    const selectedUser = this.usersById[selected.id];
    const res = this.chatsService.addChat('',selected.name,[selectedUser, this.currentUser],selected.img, "private");
    this.controllerService.onStateChange(undefined);
  }
  // smae as in group chat component
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

  FilterUsers(inputValue: string) {
    this.listUsers = this.usersItemFormat.filter(user => user.name.includes(inputValue));    
  }

}

