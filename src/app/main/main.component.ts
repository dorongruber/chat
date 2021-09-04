import { Component, OnInit } from '@angular/core';
import { slideInAnimation } from './animation';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})
export class MainComponent implements OnInit {
  title = "chats list page"
  constructor() { }

  ngOnInit(): void {
  }

}
