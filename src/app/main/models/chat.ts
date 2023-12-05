import { Subject } from "rxjs";
import { User } from "src/app/shared/models/user";
import { Message } from "./message";

export class Chat {
  private _img: File;
  constructor(
    private __id: string,
    private sid: string,
    private _name: string,
    image: File,
    private _users: User[] = [],
  ) {
    this.__id = __id;
    this.sid = sid;
    this._name = _name;
    _users = _users;
    this._img = image;
  }

  get _id() {
    return this.__id;
  }

  get id() {
    return this.sid;
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
  constructor(
    private oid: string,
    private CMid: string,
    private CMname: string,
    private CMimage: File,
    ) {
      super(oid,CMid,CMname,CMimage);
      this.lastMsg = this.resetLastMessage();
      this.newmsgscounter = 0;
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
