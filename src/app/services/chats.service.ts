import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { SocketService } from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private http: HttpClient,
     private socketService: SocketService)
  {}


}
