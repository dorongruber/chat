import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ControllerService {
  isMenuOpen = false;
  onMenuStateChange = new Subject<{state: boolean, option: number}>();
  onChatFocus = new Subject<string>();

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

  onChatFocusChange(chatId: string) {
    this.onChatFocus.next(chatId);
  }

  setFlag(state: boolean) {
    this.isMenuOpen = state;
  }
}
