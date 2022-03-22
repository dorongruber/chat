import { Subject } from "rxjs";
import { User } from "src/app/shared/models/user";
import { Message } from "./message";

export class Chat {
  private _img: File;
  constructor(
    private _id: string,
    private _name: string,
    image: File,
    private _users: User[] = [],
  ) {
    this._id = _id;
    this._name = _name;
    _users = _users;
    this._img = image;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get img() {
    return this._img;
  }

  get users() {
    return this._users;
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
    private CMimage: File,
    ) {
      super(CMid,CMname,CMimage);
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
