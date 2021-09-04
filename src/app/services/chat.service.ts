import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../main/models/user";
import { SocketService } from "./socket.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  usersInChat = new Subject<[{userId: string, userName: string, chatId: string}]>();
  constructor(private http: HttpClient,
    socketService: SocketService
    )
     {
       this.usersInChat = socketService.getUsersinChat()
       .pipe(map(response => {
         return response
       })) as Subject<[{userId: string, userName: string, chatId: string}]>
     }

}
