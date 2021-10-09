
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Message } from '../../models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {
  @Input() msgFromat: Message = {};
  constructor() { }

  ngOnInit(): void {
    console.log('on int message => ', this.msgFromat);
  }

  ngOnChanges() {
    console.log('on change message => ', this.msgFromat);
  }

}
