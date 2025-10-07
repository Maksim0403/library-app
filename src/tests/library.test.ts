import { expect } from 'chai';
import { Library } from '../models/library.js';
import { Book } from '../models/book.js';
import { User } from '../models/user.js';

describe('Library Class Tests', () => {
  let library: Library<Book>;

  beforeEach(() => {
    library = new Library<Book>();
  });

  describe('Book Management', () => {
    it('should add a book to the library', () => {
      const book = new Book('1', 'Test Book', 'Test Author', 2024);
      library.add(book);

      const books = library.all();
      expect(books).to.have.lengthOf(1);
      expect(books[0].title).to.equal('Test Book');
    });

    it('should find a book by ID', () => {
      const book = new Book('1', 'Test Book', 'Test Author', 2024);
      library.add(book);

      const foundBook = library.findById('1');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(foundBook).to.not.be.undefined;
      expect(foundBook?.title).to.equal('Test Book');
    });

    it('should return undefined for non-existent book ID', () => {
      const foundBook = library.findById('999');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(foundBook).to.be.undefined;
    });

    it('should remove a book from the library', () => {
      const book = new Book('1', 'Test Book', 'Test Author', 2024);
      library.add(book);
      library.removeById('1');

      const books = library.all();
      expect(books).to.have.lengthOf(0);
    });

    it('should get all books', () => {
      const book1 = new Book('1', 'Book 1', 'Author 1', 2024);
      const book2 = new Book('2', 'Book 2', 'Author 2', 2023);

      library.add(book1);
      library.add(book2);

      const allBooks = library.all();
      expect(allBooks).to.have.lengthOf(2);
    });

    it('should handle borrowing a book', () => {
      const book = new Book('1', 'Test Book', 'Test Author', 2024);
      library.add(book);

      book.borrow(1);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(book.isBorrowed).to.be.true;
      expect(book.borrowedBy).to.equal(1);
    });

    it('should handle returning a book', () => {
      const book = new Book('1', 'Test Book', 'Test Author', 2024);
      library.add(book);

      book.borrow(1);
      book.returned();

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(book.isBorrowed).to.be.false;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(book.borrowedBy).to.be.undefined;
    });
  });

  describe('User Management', () => {
    let userLibrary: Library<User>;

    beforeEach(() => {
      userLibrary = new Library<User>();
    });

    it('should add a user to the library', () => {
      const user = new User(1, 'John Doe', 'john@example.com');
      userLibrary.add(user);

      const users = userLibrary.all();
      expect(users).to.have.lengthOf(1);
      expect(users[0].name).to.equal('John Doe');
    });

    it('should find a user by ID', () => {
      const user = new User(1, 'John Doe', 'john@example.com');
      userLibrary.add(user);

      const foundUser = userLibrary.findById(1);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(foundUser).to.not.be.undefined;
      expect(foundUser?.email).to.equal('john@example.com');
    });

    it('should handle user borrowed count', () => {
      const user = new User(1, 'John Doe', 'john@example.com');

      expect(user.borrowedCount).to.equal(0);

      user.increment();
      expect(user.borrowedCount).to.equal(1);

      user.increment();
      user.increment();
      expect(user.borrowedCount).to.equal(3);

      user.decrement();
      expect(user.borrowedCount).to.equal(2);
    });

    it('should not allow borrowed count below zero', () => {
      const user = new User(1, 'John Doe', 'john@example.com');

      user.decrement();
      expect(user.borrowedCount).to.equal(0);
    });
  });
});
