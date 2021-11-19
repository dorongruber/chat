import { User } from "src/app/shared/models/user";

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
