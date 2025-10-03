export interface IBook {
  id: string;
  title: string;
  author: string;
  year: number;
  isBorrowed: boolean;
  borrowedBy?: number;
}

export class Book implements IBook {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public year: number,
    public isBorrowed: boolean = false,
    public borrowedBy?: number
  ) {}

  getTitle() {
    return this.title;
  }
  getAuthor() {
    return this.author;
  }
  getYear() {
    return this.year;
  }
  borrow(userId: number) {
    this.isBorrowed = true;
    this.borrowedBy = userId;
  }
  returned() {
    this.isBorrowed = false;
    this.borrowedBy = undefined;
  }
}
