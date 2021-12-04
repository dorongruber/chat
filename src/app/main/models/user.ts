export class User {
  private Id: string;
  private Name: string;

  constructor(id: string, name: string) {
    this.Id = id;
    this.Name = name;
  }

  get id() {
    return this.Id;
  }

  get name() {
    return this.Name;
  }
}
