import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { mockChatsList } from 'src/app/mockData/chatsList';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  constructor() { }
  chats = mockChatsList;
  ngOnInit(): void {
    console.log('chats list -> ', this.chats);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
