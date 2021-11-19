import { Component, OnInit } from '@angular/core';
import { ChatsService } from '../services/chats.service';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';
import { slideInAnimation } from './animation';
import { User } from './models/user';

const COMPONENT_BASE_ROUTE = '/main';
const ids = ['doron123', 'bar876'];
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})
export class MainComponent implements OnInit {
  title = "chats list page"
  baseRoute = COMPONENT_BASE_ROUTE;
  constructor(
    private userService: UserService,
    private socketService: SocketService,
    private chatService: ChatsService,
  ) { }

  async ngOnInit(): Promise<void> {
    const index = Math.floor(Math.random() * 2);
    const id = ids[index];
    console.log('id -> ', id);
    let user;
    user = await this.userService.getUserById(id);
    console.log('main component user => ', user);
    this.socketService
    .enterPool(user._id, user.name,this.chatService.GenerateId(),'generalPool');

  }

}
