import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HeaderMenuOption } from "src/app/main/models/header-menu-option";

@Injectable()
export class ControllerService {
  onMenuStateChange = new Subject<HeaderMenuOption>();
  onChatFocus = new Subject<string>();

  onStateChange(value?: HeaderMenuOption) {    
    this.onMenuStateChange.next(value);
  }

  onChatFocusChange(chatId: string) {
    this.onChatFocus.next(chatId);
  }

}
