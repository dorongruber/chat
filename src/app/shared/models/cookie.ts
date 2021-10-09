export class Cookie {
  private _key: string;
  private _value: string;

  constructor(key: string, value: string) {
    this._key = key;
    this._value = value;
  }
}
