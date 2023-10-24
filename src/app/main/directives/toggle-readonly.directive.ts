import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
    selector: '[toggleReadonly]'
})
export class ToggleReadonlyDirective {

    constructor(private el: ElementRef) { }

    @Input('toggleReadonly') set toggleReadonly(value: boolean) {
        this.el.nativeElement.readOnly  = value;
    }
}