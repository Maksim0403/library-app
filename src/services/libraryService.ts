import { Library } from '../models/library';
import { Book } from '../models/book';
import { User } from '../models/user';
import { Storage } from './storage';

const BOOKS_KEY = 'lab_books';
const USERS_KEY = 'lab_users';

export class LibraryService {
  books: Library<Book>;
  users: Library<User>;

  constructor() {
    const booksData = Storage.load<Book[]>(BOOKS_KEY, []);
    const usersData = Storage.load<User[]>(USERS_KEY, []);
    this.books = new Library<Book>(booksData.map((b) => Object.assign(new Book('', '', '', 0), b)));
    this.users = new Library<User>(usersData.map((u) => Object.assign(new User(0, '', ''), u)));
  }

  save() {
    Storage.save<Book[]>(BOOKS_KEY, this.books.all());
    Storage.save<User[]>(USERS_KEY, this.users.all());
  }

  borrow(bookId: string, userId: number): { ok: boolean; message: string } {
    const book = this.books.findById(bookId);
    if (!book) return { ok: false, message: 'Книгу не знайдено' };
    const user = this.users.findById(userId);
    if (!user) return { ok: false, message: 'Користувача не знайдено' };

    if (book.isBorrowed) return { ok: false, message: 'Книга вже зайнята!' };
    if (user.borrowedCount >= 3) return { ok: false, message: 'Користувач вже має 3 книги!' };

    book.borrow(user.id);
    user.increment();
    this.save();
    return { ok: true, message: 'Книга успішно позичена' };
  }

  returned(bookId: string): { ok: boolean; message: string } {
    const book = this.books.findById(bookId);

    if (!book) return { ok: false, message: 'Книгу не знайдено' };
    if (!book.isBorrowed) return { ok: false, message: 'Книгу не було позичено' };
    const user = this.users.findById(book.borrowedBy as number);
    if (user) user.decrement();
    book.returned();
    this.save();
    return { ok: true, message: 'Книга повернена' };
  }
}
