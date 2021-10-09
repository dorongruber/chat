import { Directive, ElementRef, Input, OnChanges, Renderer2 } from "@angular/core";
import { Inject } from "typedi";

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements OnChanges {
  @Input() Length: number = 10;
  @Input('appFocus') focusField: number = this.Length;
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges() {
    console.log('length, focusField -> ', this.Length, this.focusField);
    if (this.Length === this.focusField) {
      this.element.nativeElement.focus();
      console.log('true');
    }

  }

}
