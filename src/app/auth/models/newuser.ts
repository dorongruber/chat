export class BaseUser {
  constructor(
    private _email: string,
    private _password: string
  ) {}

  set email(email: string) {
    this._email = email;
  }

  get email() {
    return this._email;
  }

  set password(password: string) {
    this._password = password;
  }

  get password() {
    return this._password;
  }
}

export class RegisterUser extends BaseUser {

  constructor(
    email: string,
    password: string,
    private _firstName: string,
    private _lastName: string,
    private _address: string,
  ) {
    super(email,password);
  }

  set firstname(fname: string) {
    this._firstName = fname
  }

  set lastname(lname: string) {
    this._lastName = lname;
  }

  set address(address: string) {
    this._address = address;
  }

  get firstname() {
    return this._firstName;
  }

  get lastname() {
    return this._lastName;
  }

  get address() {
    return this._address;
  }
}
