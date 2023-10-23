import { Directive, OnInit, EventEmitter, Input, Output, HostListener } from "@angular/core";
import { Subject } from "rxjs";
import {
    takeUntil,
    debounceTime,
    distinctUntilChanged,
    tap
  } from "rxjs/operators";
import { SubscriptionContolService } from "src/app/services/subscription-control.service";
@Directive()
export abstract class AbstractDebounceDirective implements OnInit {
    @Input() debounceTime: number;
    @Output() onEvent: EventEmitter<any>;

    protected emitEvent$: Subject<any>;
    scs: SubscriptionContolService;
    constructor(
        subscriptionContolService: SubscriptionContolService,
    ) {
        this.scs = subscriptionContolService;
        this.debounceTime = 500;
        this.onEvent = new EventEmitter<any>();
        this.emitEvent$ = new Subject<any>();
    }

    ngOnInit(): void {
        this.emitEvent$
        .pipe(
        takeUntil(this.scs.stop$),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        tap(value => this.emitChange(value))
      )
      .subscribe();
    }

    

    public emitChange(value: any): void {
        this.onEvent.emit(value);
    }
}