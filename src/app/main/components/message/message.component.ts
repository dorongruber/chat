
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from '../../models/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements AfterViewInit {
  @Input() msgFromat: Message = {};
  @Input() index: number = 0;
  @Input() maxLength: number = 0;
  minHeight: number = 0;
  isMobile = window.innerWidth <= 640 ? true: false;
  maxLettersInLine = this.isMobile ? 35 : 65;
  constructor(private el: ElementRef<HTMLElement>) { }

  ngAfterViewInit(): void {
    if(this.msgFromat.message && this.msgFromat.message?.length > 30) {
      const len = this.msgFromat.message?.length
      this.setMgsContentHeight(len);
    }
  }

  ShowUserName() {
    return this.msgFromat.fromCurrentUser? 'ME': this.msgFromat.userName;
  }

  showDate() {
    const day = this.msgFromat.date!.getDate();
    const month = this.msgFromat.date!.getMonth();
    const year = this.msgFromat.date!.getFullYear();
    return `${day}/${month}/${year}`;
  }

  setMgsContentHeight(msgLen: number) {
    const container = (this.el.nativeElement.querySelector('.message-style-container') as HTMLElement);
    const multe = Math.floor(msgLen / this.maxLettersInLine);
    container.style.height = `${container.offsetHeight + (20 * multe)}px`;
  }

}
