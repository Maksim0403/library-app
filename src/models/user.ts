export interface IUser {
  id: number;
  name: string;
  email: string;
  borrowedCount: number;
}

export class User implements IUser {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public borrowedCount: number = 0
  ) {}

  increment() {
    this.borrowedCount++;
  }
  decrement() {
    if (this.borrowedCount > 0) this.borrowedCount--;
  }
}
