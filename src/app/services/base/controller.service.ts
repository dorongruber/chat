import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  isMenuOpen = false;
  onMenuStateChange = new Subject<{state: boolean, option: number}>();

  onStateChange(index = 0) {
    if(!index)
      this.setFlag(false);
    else
      this.setFlag(true);
    //this.isMenuOpen = !this.isMenuOpen;
    const obj = {
      state: this.isMenuOpen,
      option: index,
    }
    this.onMenuStateChange.next(obj);
  }

  setFlag(state: boolean) {
    this.isMenuOpen = state;
  }
}
