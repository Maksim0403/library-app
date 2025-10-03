export class Library<T extends { id: string | number }> {
  private items: T[] = [];

  constructor(initial: T[] = []) {
    this.items = initial;
  }

  add(item: T) {
    this.items.push(item);
  }

  removeById(id: string | number) {
    this.items = this.items.filter((i) => i.id !== id);
  }

  findById(id: string | number) {
    return this.items.find((i) => i.id === id);
  }

  search(predicate: (item: T) => boolean) {
    return this.items.filter(predicate);
  }

  all() {
    return [...this.items];
  }

  clear() {
    this.items = [];
  }
}
