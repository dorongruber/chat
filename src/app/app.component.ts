import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

const ROUTE_TO_CHECK = '/main/chats/'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  subscription = new Subscription();
  title = 'chat';
  isChatOpen = false;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.AutoLogin();
  }

}
