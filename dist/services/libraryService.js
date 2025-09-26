"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryService = void 0;
var library_1 = require("../models/library");
var book_1 = require("../models/book");
var user_1 = require("../models/user");
var storage_1 = require("./storage");
var BOOKS_KEY = 'lab_books';
var USERS_KEY = 'lab_users';
var LibraryService = /** @class */ (function () {
    function LibraryService() {
        var booksData = storage_1.Storage.load(BOOKS_KEY, []);
        var usersData = storage_1.Storage.load(USERS_KEY, []);
        this.books = new library_1.Library(booksData.map(function (b) { return Object.assign(new book_1.Book('', '', '', 0), b); }));
        this.users = new library_1.Library(usersData.map(function (u) { return Object.assign(new user_1.User(0, '', ''), u); }));
    }
    LibraryService.prototype.save = function () {
        storage_1.Storage.save(BOOKS_KEY, this.books.all());
        storage_1.Storage.save(USERS_KEY, this.users.all());
    };
    LibraryService.prototype.borrow = function (bookId, userId) {
        var book = this.books.findById(bookId);
        if (!book)
            return { ok: false, message: 'Книгу не знайдено' };
        var user = this.users.findById(userId);
        if (!user)
            return { ok: false, message: 'Користувача не знайдено' };
        if (book.isBorrowed)
            return { ok: false, message: 'Книга вже зайнята!' };
        if (user.borrowedCount >= 3)
            return { ok: false, message: 'Користувач вже має 3 книги!' };
        book.borrow(user.id);
        user.increment();
        this.save();
        return { ok: true, message: 'Книга успішно позичена' };
    };
    LibraryService.prototype.returned = function (bookId) {
        var book = this.books.findById(bookId);
        if (!book)
            return { ok: false, message: 'Книгу не знайдено' };
        if (!book.isBorrowed)
            return { ok: false, message: 'Книгу не було позичено' };
        var user = this.users.findById(book.borrowedBy);
        if (user)
            user.decrement();
        book.returned();
        this.save();
        return { ok: true, message: 'Книга повернена' };
    };
    return LibraryService;
}());
exports.LibraryService = LibraryService;
