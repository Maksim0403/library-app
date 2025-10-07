import { Book } from './models/book.js';
import { User } from './models/user.js';
import { LibraryService } from './services/libraryService.js';
import { Validators } from './utils/validation.js';

class App {
  private svc: LibraryService;
  private el: {
    bookForm: HTMLFormElement;
    userForm: HTMLFormElement;
    booksList: HTMLElement;
    usersList: HTMLElement;
    searchBooks: HTMLInputElement;
    booksPagination: HTMLElement;
  };

  constructor() {
    this.svc = new LibraryService();
    this.el = {
      bookForm: document.getElementById('book-form') as HTMLFormElement,
      userForm: document.getElementById('user-form') as HTMLFormElement,
      booksList: document.getElementById('books-list')!,
      usersList: document.getElementById('users-list')!,
      searchBooks: document.getElementById('search-books') as HTMLInputElement,
      booksPagination: document.getElementById('books-pagination')!,
    };

    this.init();
  }

  private showToast(
    message: string,
    callback?: (value: string) => void,
    showInput: boolean = false
  ) {
    const body = document.getElementById('modal-body')!;
    const input = document.getElementById('modal-input') as HTMLInputElement;
    const okBtn = document.getElementById('modal-ok') as HTMLButtonElement;
    const modalEl = document.getElementById('confirmModal')!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modal = new (window as any).bootstrap.Modal(modalEl);

    body.textContent = message;
    input.value = '';

    if (showInput) {
      input.style.display = 'block';
    } else {
      input.style.display = 'none';
    }

    okBtn.onclick = () => {
      modal.hide();
      if (callback) callback(input.value.trim());
    };

    modal.show();
  }

  private renderBooks(page = 1, perPage = 5, query = '') {
    const all = this.svc.books.all();

    const filtered = query
      ? all.filter(
          (b) =>
            b.title.toLowerCase().includes(query.toLowerCase()) ||
            b.author.toLowerCase().includes(query.toLowerCase())
        )
      : all;

    const start = (page - 1) * perPage;
    const pageItems = filtered.slice(start, start + perPage);

    this.el.booksList.innerHTML = pageItems
      .map(
        (b) => `
        <div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white">
            <div>
                <strong>${b.title}</strong> — ${b.author} (${b.year}) ${b.isBorrowed ? '<span class="badge bg-danger ms-2">Позичено</span>' : ''}
            </div>
            <div>
                ${b.isBorrowed ? '<button data-id="' + b.id + '" class="btn btn-sm btn-success return-btn">Повернути</button>' : '<button data-id="' + b.id + '" class="btn btn-sm btn-primary borrow-btn">Позичити</button>'}
                <button data-id="${b.id}" class="btn btn-sm btn-danger ms-1 delete-book">Видалити</button>
            </div>
        </div> `
      )
      .join('');

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const pag = this.el.booksPagination;

    pag.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = 'page-item' + (i === page ? ' active' : '');
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.onclick = (ev) => {
        ev.preventDefault();
        this.renderBooks(i, perPage, query);
      };
      pag.appendChild(li);
    }

    document.querySelectorAll('.borrow-btn').forEach((btn) => {
      (btn as HTMLButtonElement).onclick = () => {
        const id = (btn as HTMLButtonElement).getAttribute('data-id')!;
        this.showToast(
          'Введіть ID користувача для позичення книги: ',
          (userId) => {
            if (!userId) return;
            if (!/^\d+$/.test(userId)) {
              this.showToast('ID користувача має бути цифрами');
              return;
            }
            const res = this.svc.borrow(id, Number(userId));
            this.showToast(res.message);
            this.renderAll();
          },
          true
        );
      };
    });

    document.querySelectorAll('.return-btn').forEach((btn) => {
      (btn as HTMLButtonElement).onclick = () => {
        const id = (btn as HTMLButtonElement).getAttribute('data-id')!;
        const res = this.svc.returned(id);
        this.showToast(res.message);
        this.renderAll();
      };
    });

    document.querySelectorAll('.delete-book').forEach((btn) => {
      (btn as HTMLButtonElement).onclick = () => {
        const id = (btn as HTMLButtonElement).getAttribute('data-id')!;
        const book = this.svc.books.findById(id);
        if (book && book.isBorrowed && typeof book.borrowedBy !== 'undefined') {
          const borrower = this.svc.users.findById(book.borrowedBy);
          if (borrower) borrower.decrement();
        }
        this.svc.books.removeById(id);
        this.svc.save();
        this.renderAll();
      };
    });
  }

  public renderUsers() {
    const users = this.svc.users.all();
    this.el.usersList.innerHTML = users
      .map(
        (u) => `
        <div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white">
            <div>${u.id} — <strong>${u.name}</strong> (email: ${u.email})</div>
            <div><button data-id="${u.id}" class="btn btn-sm btn-danger delete-user">Видалити</button></div>
        </div>
        `
      )
      .join('');

    document.querySelectorAll('.delete-user').forEach((btn) => {
      (btn as HTMLElement).onclick = () => {
        const id = Number((btn as HTMLElement).getAttribute('data-id'));
        this.svc.users.removeById(id);
        this.svc.save();
        this.renderAll();
      };
    });
  }

  public renderAll() {
    this.renderBooks(1, 5, this.el.searchBooks.value);
    this.renderUsers();
  }

  private init() {
    this.el.bookForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const title = (document.getElementById('book-title') as HTMLInputElement).value.trim();
      const author = (document.getElementById('book-author') as HTMLInputElement).value.trim();
      const year = (document.getElementById('book-year') as HTMLInputElement).value.trim();

      let valid = true;
      if (!title) {
        valid = false;
        (document.getElementById('book-title') as HTMLInputElement).classList.add('is-invalid');
      } else
        (document.getElementById('book-title') as HTMLInputElement).classList.remove('is-invalid');
      if (!author) {
        valid = false;
        (document.getElementById('book-author') as HTMLInputElement).classList.add('is-invalid');
      } else
        (document.getElementById('book-author') as HTMLInputElement).classList.remove('is-invalid');
      if (!Validators.isYear(year)) {
        valid = false;
        (document.getElementById('book-year') as HTMLInputElement).classList.add('is-invalid');
      } else
        (document.getElementById('book-year') as HTMLInputElement).classList.remove('is-invalid');

      if (!valid) return;

      const id = 'b_' + Date.now();
      const b = new Book(id, title, author, Number(year));
      this.svc.books.add(b);
      this.svc.save();
      this.el.bookForm.reset();
      this.renderAll();
      this.showToast('Book added');
    });

    this.el.userForm.addEventListener('submit', (ev) => {
      ev.preventDefault();

      const name = (document.getElementById('user-name') as HTMLInputElement).value.trim();
      const email = (document.getElementById('user-email') as HTMLInputElement).value.trim();

      let valid = true;

      if (!name) {
        valid = false;
        (document.getElementById('user-name') as HTMLInputElement).classList.add('is-invalid');
      } else {
        (document.getElementById('user-name') as HTMLInputElement).classList.remove('is-invalid');
      }

      if (!Validators.isEmail(email)) {
        valid = false;
        (document.getElementById('user-email') as HTMLInputElement).classList.add('is-invalid');
      } else {
        (document.getElementById('user-email') as HTMLInputElement).classList.remove('is-invalid');
      }

      if (!valid) return;

      const id = Date.now();
      if (this.svc.users.findById(id)) {
        this.showToast('Користувач з таким ID вже існує');
        return;
      }

      const u = new User(id, name, email);
      this.svc.users.add(u);
      this.svc.save();
      this.el.userForm.reset();
      this.renderAll();
      this.showToast('Користувач створений');
    });

    this.el.searchBooks.addEventListener('input', () =>
      this.renderBooks(1, 5, this.el.searchBooks.value)
    );

    this.renderAll();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
