import { StringMapWithRename } from "@angular/compiler/src/compiler_facade_interface";

export class Message {
  private message: string;
  private userId: string;
  private chatId: string;

  constructor(uid: string,cid: string,msg: string) {
    this.message = msg;
    this.userId = uid;
    this.chatId = cid;
  }
}
