import { Type } from "@angular/core";

export class DynamicComponentRef {
    constructor(public bodyComponent: Type<any>) {}
}