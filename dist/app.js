"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var book_1 = require("./models/book");
var user_1 = require("./models/user");
var libraryService_1 = require("./services/libraryService");
var validation_1 = require("./utils/validation");
var App = /** @class */ (function () {
    function App() {
        this.svc = new libraryService_1.LibraryService();
        this.el = {
            bookForm: document.getElementById('book-form'),
            userForm: document.getElementById('user-form'),
            booksList: document.getElementById('books-list'),
            usersList: document.getElementById('users-list'),
            searchBooks: document.getElementById('search-books'),
            booksPagination: document.getElementById('books-pagination')
        };
        this.init();
    }
    App.prototype.showToast = function (message, callback, showInput) {
        if (showInput === void 0) { showInput = false; }
        var body = document.getElementById('modal-body');
        var input = document.getElementById('modal-input');
        var okBtn = document.getElementById('modal-ok');
        var modalEl = document.getElementById('confirmModal');
        var modal = new window.bootstrap.Modal(modalEl);
        body.textContent = message;
        input.value = '';
        if (showInput) {
            input.style.display = 'block';
        }
        else {
            input.style.display = 'none';
        }
        okBtn.onclick = function () {
            modal.hide();
            if (callback)
                callback(input.value.trim());
        };
        modal.show();
    };
    App.prototype.renderBooks = function (page, perPage, query) {
        var _this = this;
        if (page === void 0) { page = 1; }
        if (perPage === void 0) { perPage = 5; }
        if (query === void 0) { query = ''; }
        var all = this.svc.books.all();
        var filtered = query ? all.filter(function (b) {
            return b.title.toLowerCase().includes(query.toLowerCase()) ||
                b.author.toLowerCase().includes(query.toLowerCase());
        }) : all;
        var start = (page - 1) * perPage;
        var pageItems = filtered.slice(start, start + perPage);
        this.el.booksList.innerHTML = pageItems.map(function (b) { return "\n        <div class=\"d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white\">\n            <div>\n                <strong>".concat(b.title, "</strong> \u2014 ").concat(b.author, " (").concat(b.year, ") ").concat(b.isBorrowed ? '<span class="badge bg-danger ms-2">Borrowed</span>' : '', "\n            </div>\n            <div>\n                ").concat(b.isBorrowed ? '<button data-id="' + b.id + '" class="btn btn-sm btn-success return-btn">Return</button>' : '<button data-id="' + b.id + '" class="btn btn-sm btn-primary borrow-btn">Borrow</button>', "\n                <button data-id=\"").concat(b.id, "\" class=\"btn btn-sm btn-danger ms-1 delete-book\">Delete</button>\n            </div>\n        </div> "); }).join('');
        var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
        var pag = this.el.booksPagination;
        pag.innerHTML = '';
        var _loop_1 = function (i) {
            var li = document.createElement('li');
            li.className = 'page-item' + (i === page ? ' active' : '');
            li.innerHTML = "<a class=\"page-link\" href=\"#\">".concat(i, "</a>");
            li.onclick = function (ev) {
                ev.preventDefault();
                _this.renderBooks(i, perPage, query);
            };
            pag.appendChild(li);
        };
        for (var i = 1; i <= totalPages; i++) {
            _loop_1(i);
        }
        document.querySelectorAll('.borrow-btn').forEach(function (btn) {
            btn.onclick = function () {
                var id = btn.getAttribute('data-id');
                _this.showToast('Введіть ID користувача для позичення книги: ', function (userId) {
                    if (!userId)
                        return;
                    if (!/^\d+$/.test(userId)) {
                        _this.showToast('ID користувача має бути цифрами');
                        return;
                    }
                    var res = _this.svc.borrow(id, Number(userId));
                    _this.showToast(res.message);
                    _this.renderAll();
                }, true);
            };
        });
        document.querySelectorAll('.return-btn').forEach(function (btn) {
            btn.onclick = function () {
                var id = btn.getAttribute('data-id');
                var res = _this.svc.returned(id);
                _this.showToast(res.message);
                _this.renderAll();
            };
        });
        document.querySelectorAll('.delete-book').forEach(function (btn) {
            btn.onclick = function () {
                var id = btn.getAttribute('data-id');
                _this.svc.books.removeById(id);
                var users = _this.svc.users.all();
                users.forEach(function (user) {
                    user.decrement();
                });
                _this.svc.save();
                _this.renderAll();
            };
        });
    };
    App.prototype.renderUsers = function () {
        var _this = this;
        var users = this.svc.users.all();
        this.el.usersList.innerHTML = users.map(function (u) { return "\n        <div class=\"d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white\">\n            <div>".concat(u.id, " \u2014 <strong>").concat(u.name, "</strong> (email: ").concat(u.email, ")</div>\n            <div><button data-id=\"").concat(u.id, "\" class=\"btn btn-sm btn-danger delete-user\">Delete</button></div>\n        </div>\n        "); }).join('');
        document.querySelectorAll('.delete-user').forEach(function (btn) {
            btn.onclick = function () {
                var id = Number(btn.getAttribute('data-id'));
                _this.svc.users.removeById(id);
                _this.svc.save();
                _this.renderAll();
            };
        });
    };
    App.prototype.renderAll = function () {
        this.renderBooks(1, 5, this.el.searchBooks.value);
        this.renderUsers();
    };
    App.prototype.init = function () {
        var _this = this;
        this.el.bookForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var title = document.getElementById('book-title').value.trim();
            var author = document.getElementById('book-author').value.trim();
            var year = document.getElementById('book-year').value.trim();
            var valid = true;
            if (!title) {
                valid = false;
                document.getElementById('book-title').classList.add('is-invalid');
            }
            else
                document.getElementById('book-title').classList.remove('is-invalid');
            if (!author) {
                valid = false;
                document.getElementById('book-author').classList.add('is-invalid');
            }
            else
                document.getElementById('book-author').classList.remove('is-invalid');
            if (!validation_1.Validators.isYear(year)) {
                valid = false;
                document.getElementById('book-year').classList.add('is-invalid');
            }
            else
                document.getElementById('book-year').classList.remove('is-invalid');
            if (!valid)
                return;
            var id = 'b_' + Date.now();
            var b = new book_1.Book(id, title, author, Number(year));
            _this.svc.books.add(b);
            _this.svc.save();
            _this.el.bookForm.reset();
            _this.renderAll();
            _this.showToast('Book added');
        });
        this.el.userForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var name = document.getElementById('user-name').value.trim();
            var email = document.getElementById('user-email').value.trim();
            var valid = true;
            if (!name) {
                valid = false;
                document.getElementById('user-name').classList.add('is-invalid');
            }
            else {
                document.getElementById('user-name').classList.remove('is-invalid');
            }
            if (!validation_1.Validators.isEmail(email)) {
                valid = false;
                document.getElementById('user-email').classList.add('is-invalid');
            }
            else {
                document.getElementById('user-email').classList.remove('is-invalid');
            }
            if (!valid)
                return;
            var id = Date.now();
            if (_this.svc.users.findById(id)) {
                _this.showToast('User with this id already exists');
                return;
            }
            var u = new user_1.User(id, name, email);
            _this.svc.users.add(u);
            _this.svc.save();
            _this.el.userForm.reset();
            _this.renderAll();
            _this.showToast('User added');
        });
        this.el.searchBooks.addEventListener('input', function () { return _this.renderBooks(1, 5, _this.el.searchBooks.value); });
        this.renderAll();
    };
    return App;
}());
document.addEventListener('DOMContentLoaded', function () {
    new App();
});
