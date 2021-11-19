import { Injectable } from "@angular/core";
import { User } from "../shared/models/user";
import { BaseService } from "./base/base.service";

import { SocketService } from "./socket.service";

const MULTE = 1000000000000000;

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private baseService: BaseService,
     private socketService: SocketService)
  {}

  getChats() {}

  addChat(name: string, users: User[], userId: string) {
    this.socketService.createChat(this.GenerateId(),name,users, userId);
  }

  GenerateId() {
    const randomId = Number(Math.random() * MULTE).toFixed(0).toString();
    //console.log('randomId -> ', randomId);
    return randomId;
  }
}
