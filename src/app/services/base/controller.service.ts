import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  isMenuOpen = false;
  onMenuStateChange = new Subject<boolean>();

  onStateChange() {
    this.isMenuOpen = !this.isMenuOpen;
    this.onMenuStateChange.next(this.isMenuOpen);
  }
}
