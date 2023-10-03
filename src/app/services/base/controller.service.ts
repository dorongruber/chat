import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ControllerService {
  isMenuOpen = false;
  onMenuStateChange = new Subject<string>();
  onChatFocus = new Subject<string>();

  onStateChange(value?: string) {
    //this.isMenuOpen = !this.isMenuOpen;
    
    this.onMenuStateChange.next(value);
  }

  onChatFocusChange(chatId: string) {
    this.onChatFocus.next(chatId);
  }

}
