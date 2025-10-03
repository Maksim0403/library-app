export class Storage {
  static save<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  static load<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }
  static remove(key: string) {
    localStorage.removeItem(key);
  }
  static clear() {
    localStorage.clear();
  }
}
