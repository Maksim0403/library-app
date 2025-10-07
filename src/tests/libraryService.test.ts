import { expect } from 'chai';
import { LibraryService } from '../services/libraryService.js';
import { Book } from '../models/book.js';
import { User } from '../models/user.js';

const createLocalStorageMock = (): Storage => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key: (index: number): string | null => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

Object.defineProperty(global, 'localStorage', {
  value: createLocalStorageMock(),
  writable: true,
  configurable: true,
});

describe('LibraryService Tests', () => {
  let service: LibraryService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    service = new LibraryService();
  });

  describe('Initialization', () => {
    it('should initialize with empty books and users', () => {
      expect(service.books.all()).to.have.lengthOf(0);

      expect(service.users.all()).to.have.lengthOf(0);
    });
  });

  describe('Borrow Functionality', () => {
    beforeEach(() => {
      const book = new Book('1', 'Test Book', 'Test Author', 2024);
      const user = new User(1, 'John Doe', 'john@example.com');
      service.books.add(book);
      service.users.add(user);
    });

    it('should successfully borrow a book', () => {
      const result = service.borrow('1', 1);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result.ok).to.be.true;

      expect(result.message).to.equal('Книга успішно позичена');

      const book = service.books.findById('1');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(book?.isBorrowed).to.be.true;

      expect(book?.borrowedBy).to.equal(1);

      const user = service.users.findById(1);

      expect(user?.borrowedCount).to.equal(1);
    });

    it('should fail when book does not exist', () => {
      const result = service.borrow('999', 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result.ok).to.be.false;

      expect(result.message).to.equal('Книгу не знайдено');
    });

    it('should fail when user does not exist', () => {
      const result = service.borrow('1', 999);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result.ok).to.be.false;

      expect(result.message).to.equal('Користувача не знайдено');
    });

    it('should fail when book is already borrowed', () => {
      service.borrow('1', 1);
      const result = service.borrow('1', 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result.ok).to.be.false;

      expect(result.message).to.equal('Книга вже зайнята!');
    });

    it('should fail when user has 3 borrowed books', () => {
      const user = service.users.findById(1)!;
      user.increment();
      user.increment();
      user.increment();

      const result = service.borrow('1', 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result.ok).to.be.false;

      expect(result.message).to.equal('Користувач вже має 3 книги!');
    });
  });

  describe('Return Functionality', () => {
    beforeEach(() => {
      const book = new Book('1', 'Test Book', 'Test Author', 2024);
      const user = new User(1, 'John Doe', 'john@example.com');
      service.books.add(book);
      service.users.add(user);
      service.borrow('1', 1);
    });

    it('should successfully return a book', () => {
      const result = service.returned('1');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result.ok).to.be.true;

      expect(result.message).to.equal('Книга повернена');

      const book = service.books.findById('1');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(book?.isBorrowed).to.be.false;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(book?.borrowedBy).to.be.undefined;

      const user = service.users.findById(1);

      expect(user?.borrowedCount).to.equal(0);
    });

    it('should fail when book does not exist', () => {
      const result = service.returned('999');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result.ok).to.be.false;

      expect(result.message).to.equal('Книгу не знайдено');
    });

    it('should fail when book is not borrowed', () => {
      service.returned('1'); // Return once
      const result = service.returned('1'); // Try to return again
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(result.ok).to.be.false;

      expect(result.message).to.equal('Книгу не було позичено');
    });
  });

  describe('Multiple Books and Users', () => {
    it('should handle multiple borrows correctly', () => {
      const book1 = new Book('1', 'Book 1', 'Author 1', 2024);
      const book2 = new Book('2', 'Book 2', 'Author 2', 2024);
      const user = new User(1, 'John Doe', 'john@example.com');

      service.books.add(book1);
      service.books.add(book2);
      service.users.add(user);

      service.borrow('1', 1);
      service.borrow('2', 1);

      const updatedUser = service.users.findById(1);

      expect(updatedUser?.borrowedCount).to.equal(2);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(service.books.findById('1')?.isBorrowed).to.be.true;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(service.books.findById('2')?.isBorrowed).to.be.true;
    });
  });
});
