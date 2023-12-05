export class User {
  private __id: string;
  private _sid: string;
  private _name: string;
  private _phone: string;
  private _password: string;
  private _email: string;
  private _img: File;
  constructor(
    _id: string,
    id: string,
    name: string,
    phone: string,
    password: string,
    email: string,
    image: File,
  ) {
    this.__id = _id;
    this._sid = id;
    this._name = name;
    this._phone = phone;
    this._password = password;
    this._email = email;
    this._img = image;
  }

  get _id() {
    return this.__id;
  }

  get id() {
    return this._sid;
  }

  get name() {
    return this._name;
  }

  get phone() {
    return this._phone;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password
  }

  get img() {
    return this._img;
  }

  getUser() {
    return {
      _id: this._id,
      id: this.id,
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password,
      img: this.img,
    };
  }
}
