import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() option: number = 0;
  @Input() user: User | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
