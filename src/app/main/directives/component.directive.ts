import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[bodyHost]'
})
export class ComponentDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}