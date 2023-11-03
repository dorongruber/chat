import { Directive, HostListener } from "@angular/core";
import { AbstractDebounceDirective } from "./abstract-debounce.directive";
import { SubscriptionContolService } from "src/app/services/subscription-control.service";


@Directive({
    selector: "[debounceKeyUp]"
})
  export class DebounceKeyupDirective extends AbstractDebounceDirective {
    constructor(private subscriptionContolService: SubscriptionContolService) {
      super(subscriptionContolService);
    }
  
    @HostListener("keyup", ["$event"])
    public onKeyUp(event: any): void {
      event.preventDefault();
      this.emitEvent$.next(event);
    }
  }