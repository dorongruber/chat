import { Subject } from "rxjs";
import { User } from "src/app/shared/models/user";
import { Message } from "./message";

export class Chat {

  constructor(
    private _id: string,
    private _name: string,
    private users: User[] = []
  ) {
    this._id = _id;
    this._name = _name;
    users = users;

  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}


export class ChatInMenu extends Chat {
  public lastMsg: Message;
  public newmsgscounter: number;
  public onMsgChange: Subject<Message>;
  public onCounterChange: Subject<number>;
  constructor(
    private CMid: string,
    private CMname: string,
    ) {
      super(CMid,CMname);
      this.lastMsg = this.resetLastMessage();
      this.newmsgscounter = 0;
      this.onMsgChange = new Subject<Message>();
      this.onCounterChange = new Subject<number>();
  }

  resetLastMessage() {
    return {
      message: '',
      userId: '',
      userName: '',
      date: undefined,
      fromCurrentUser: true,
    };
  }
}
