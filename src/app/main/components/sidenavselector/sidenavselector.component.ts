import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { DynamicComponentRef } from '../../directives/dynamic-component.ref.directive';
import { ComponentDirective } from '../../directives/component.directive';

@Component({
  selector: 'app-sidenavselector',
  templateUrl: './sidenavselector.component.html',
  styleUrls: ['./sidenavselector.component.scss']
})
export class SidenavselectorComponent implements OnChanges {
  @Input() componentRef?: DynamicComponentRef | undefined;
  @ViewChild(ComponentDirective, { static: true}) bodyHost?: ComponentDirective;

  ngOnChanges(): void {
    if(this.componentRef && this.bodyHost) {
      this.bodyHost.viewContainerRef.clear();
      const ref = this.bodyHost.viewContainerRef.createComponent(this.componentRef.bodyComponent);
    }
  }
}
