import { Injectable } from "@angular/core";
import { BaseService } from "./base/base.service";

import { SocketService } from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private baseService: BaseService,
     private socketService: SocketService)
  {}


}
