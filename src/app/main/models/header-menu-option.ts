import { DynamicComponentRef } from "../directives/dynamic-component.ref.directive";

export class HeaderMenuOption {
    title: string;
    icon: string;
    path: string;
    componentRef?: DynamicComponentRef;
    constructor(title: string, icon: string, path: string, componentRef: DynamicComponentRef | undefined = undefined) {
        this.title = title;
        this.icon = icon;
        this.path = path;
        this.componentRef = componentRef;
    }
}
