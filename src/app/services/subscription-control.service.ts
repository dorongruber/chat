import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SubscriptionContolService {
    stop$ = new Subject<void>();

    stop() {
        this.stop$.next();
        this.stop$.complete();
    }
}