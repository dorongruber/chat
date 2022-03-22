import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDynamicheight]'
})
export class DynamicheightDirective {
  @HostBinding('style.minHeight') minHeight: string;
  constructor(private el: ElementRef<HTMLElement>) {
    const msgElHeight = `${(this.el.nativeElement.querySelector('.message-content') as HTMLElement).offsetHeight} + 5px`;
    this.minHeight = msgElHeight;
   }

}
