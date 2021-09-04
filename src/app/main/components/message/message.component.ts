import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {
  @Input() message: string = '';
  constructor() { }

  ngOnInit(): void {
    console.log('on int message => ', this.message);
  }

  ngOnChanges() {
    console.log('on change message => ', this.message);
  }

}
