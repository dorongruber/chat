import { IKeyCollection } from './ikeycollection.model';

export class Dictionary<T> implements IKeyCollection<T> {
  protected items: {[index: string]: T} = {};
  private count = 0;
  add(key: string, value: T): T {
    console.log('!this.items.hasOwnProperty(key) -> ', !this.items.hasOwnProperty(key));
    if (!this.items.hasOwnProperty(key)) {
      console.log('count');
      this.count++;
    }

    this.items[key] = value;
    return this.items[key];
  }

  containsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  size(): number {
    return this.count;
  }

  getItem(key: string): T {
    return this.items[key];
  }

  removeItem(key: string): T {
    const value = this.items[key];

    delete this.items[key];
    this.count--;

    return value;
  }

  getKeys(): string[] {
    const keySet: string[] = [];
    console.log('getkeys -> ', this.items, this.count);
    for (const property in this.items) {
      if (this.items.hasOwnProperty(property)) {
        keySet.push(property);
      }
    }
    return keySet;
  }

  values(): T[] {
    const values: T[] = [];

    for (const property in this.items) {
      if (this.items.hasOwnProperty(property)) {
        values.push(this.items[property]);
      }
    }
    return values;
  }

}
