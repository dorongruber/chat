export interface IKeyCollection<T> {
  add(key: string, value: T): T;
  containsKey(key: string): boolean;
  size(): number;
  getItem(key: string): T;
  removeItem(key: string): T;
  getKeys(): string[];
  values(): T[];
}
