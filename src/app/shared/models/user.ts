export class User {
  private _id: string;
  private _name: string;
  private _phone: string;
  private _password: string;
  private _email: string;
  constructor(
    id: string,
    name: string,
    phone: string,
    password: string,
    email: string,
  ) {
    this._id = id;
    this._name = name;
    this._phone = phone;
    this._password = password;
    this._email = email;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  getUser() {
    return this;
  }
}
