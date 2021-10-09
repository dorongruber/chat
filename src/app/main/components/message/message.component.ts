
import { Component, Input, OnChanges } from '@angular/core';
import { Message } from '../../models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnChanges {
  @Input() msgFromat: Message = {};
  @Input() index: number = 0;
  @Input() maxLength: number = 0;
  constructor() { }

  ngOnChanges() {
    // console.group('compare dates in message');
    // console.log('nsg date from input element -> ',this.msgFromat.date);
    // console.log('create msg date with new Date => ', new Date(this.msgFromat.date as Date));
    // console.groupEnd();
  }

  ShowUserName() {
    return this.msgFromat.fromCurrentUser? 'ME': this.msgFromat.userName;
  }

  showDate() {
    const date = new Date(this.msgFromat.date as Date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

}
