import { Location, PathLocationStrategy } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceTypeService } from "./devicetype.service";

@Injectable({
    providedIn: 'root'
})
export class LocationSevice {
    isMobile: boolean;
    constructor(
        private location: Location,
        private deviceTypeService: DeviceTypeService,
        private router: Router, 
        private route: ActivatedRoute) {
            this.isMobile = this.deviceTypeService.isMobile;
            this.location.onUrlChange((url, state) => {
                console.log("on url chage ==> ", url, state);
                
            });
        }


    go(path: string, queryParams?: string) {
        this.location.go(path, queryParams);
    }

    back() {
        this.location.back();
    }

    forward() {
        this.location.forward()
    }
    
    enableNavigation(path: string, queryParams?: string) {
        if(this.isMobile)
            this.go(path, queryParams);
        else
            this.onNavigationChage(path,queryParams);
    }
    onNavigationChage(path: string, queryParams?: string) {
        console.log("this.route.parent ==> ", this.route);
        
        this.router.navigate([path], {relativeTo: this.route});
    }   

    get path() {
        return this.location.path();
    }
}