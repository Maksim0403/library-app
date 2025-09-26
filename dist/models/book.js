"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
var Book = /** @class */ (function () {
    function Book(id, title, author, year, isBorrowed, borrowedBy) {
        if (isBorrowed === void 0) { isBorrowed = false; }
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.isBorrowed = isBorrowed;
        this.borrowedBy = borrowedBy;
    }
    Book.prototype.getTitle = function () { return this.title; };
    Book.prototype.getAuthor = function () { return this.author; };
    Book.prototype.getYear = function () { return this.year; };
    Book.prototype.borrow = function (userId) { this.isBorrowed = true; this.borrowedBy = userId; };
    Book.prototype.returned = function () { this.isBorrowed = false; this.borrowedBy = undefined; };
    return Book;
}());
exports.Book = Book;
