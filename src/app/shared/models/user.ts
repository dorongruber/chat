export class User {
  private _id: string;
  private _name: string;
  private _phone: string;
  private _password: string;
  private _email: string;
  private _img: File;
  constructor(
    id: string,
    name: string,
    phone: string,
    password: string,
    email: string,
    image: File,
  ) {
    this._id = id;
    this._name = name;
    this._phone = phone;
    this._password = password;
    this._email = email;
    this._img = image;
  }

  get id() {
    return this._id;
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
      id: this.id,
      name: this.name,
      phone: this.phone,
      email: this.email,
      password: this.password,
      img: this.img,
    };
  }
}
