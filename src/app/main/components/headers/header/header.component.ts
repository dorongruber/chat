import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { ComponentDirective } from '../../../directives/component.directive';
import { DynamicComponentRef } from '../../../directives/dynamic-component.ref.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges {
  isChatOpen = false;
  @Input() menuOptions: any[] = [];
  @Input() title: string = '';
  
  @Input() componentRef?: DynamicComponentRef | undefined;
  @ViewChild(ComponentDirective, { static: true}) bodyHost?: ComponentDirective;

  constructor() { }

  ngOnChanges(): void {
    if(this.componentRef && this.bodyHost) {
      this.bodyHost.viewContainerRef.clear();
      const ref = this.bodyHost.viewContainerRef.createComponent(this.componentRef.bodyComponent);
      ref.instance.menuOptions = this.menuOptions;
      ref.instance.title = this.title;
    }
  }
  

}
