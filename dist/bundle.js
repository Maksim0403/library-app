/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_book__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/book */ \"./src/models/book.ts\");\n/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/user */ \"./src/models/user.ts\");\n/* harmony import */ var _services_libraryService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/libraryService */ \"./src/services/libraryService.ts\");\n/* harmony import */ var _utils_validation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/validation */ \"./src/utils/validation.ts\");\n\n\n\n\nvar svc = new _services_libraryService__WEBPACK_IMPORTED_MODULE_2__.LibraryService();\nvar el = {\n    bookForm: document.getElementById('book-form'),\n    userForm: document.getElementById('user-form'),\n    booksList: document.getElementById('books-list'),\n    usersList: document.getElementById('users-list'),\n    searchBooks: document.getElementById('search-books'),\n    booksPagination: document.getElementById('books-pagination')\n};\nfunction showToast(message, type) {\n    if (type === void 0) { type = 'info'; }\n    var body = document.getElementById('modal-body');\n    body.textContent = message;\n    var modalEl = document.getElementById('confirmModal');\n    var modal = new window.bootstrap.Modal(modalEl);\n    document.getElementById('modal-ok').onclick = function () { return modal.hide(); };\n    modal.show();\n}\nfunction renderBooks(page, perPage, query) {\n    if (page === void 0) { page = 1; }\n    if (perPage === void 0) { perPage = 5; }\n    if (query === void 0) { query = ''; }\n    var all = svc.books.all();\n    var filtered = query ? all.filter(function (b) {\n        return b.title.toLowerCase().includes(query.toLowerCase()) ||\n            b.author.toLowerCase().includes(query.toLowerCase());\n    }) : all;\n    var start = (page - 1) * perPage;\n    var pageItems = filtered.slice(start, start + perPage);\n    el.booksList.innerHTML = pageItems.map(function (b) { return \"\\n    <div class=\\\"d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white\\\">\\n      <div>\\n        <strong>\".concat(b.title, \"</strong> \\u2014 \").concat(b.author, \" (\").concat(b.year, \") \").concat(b.isBorrowed ? '<span class=\"badge bg-danger ms-2\">Borrowed</span>' : '', \"\\n      </div>\\n      <div>\\n        \").concat(b.isBorrowed ? '<button data-id=\"' + b.id + '\" class=\"btn btn-sm btn-success return-btn\">Return</button>' : '<button data-id=\"' + b.id + '\" class=\"btn btn-sm btn-primary borrow-btn\">Borrow</button>', \"\\n        <button data-id=\\\"\").concat(b.id, \"\\\" class=\\\"btn btn-sm btn-danger ms-1 delete-book\\\">Delete</button>\\n      </div>\\n    </div>\\n  \"); }).join('');\n    var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));\n    var pag = document.getElementById('books-pagination');\n    pag.innerHTML = '';\n    var _loop_1 = function (i) {\n        var li = document.createElement('li');\n        li.className = 'page-item' + (i === page ? ' active' : '');\n        li.innerHTML = \"<a class=\\\"page-link\\\" href=\\\"#\\\">\".concat(i, \"</a>\");\n        li.onclick = function (ev) { ev.preventDefault(); renderBooks(i, perPage, query); };\n        pag.appendChild(li);\n    };\n    for (var i = 1; i <= totalPages; i++) {\n        _loop_1(i);\n    }\n    document.querySelectorAll('.borrow-btn').forEach(function (btn) {\n        btn.onclick = function () {\n            var id = btn.getAttribute('data-id');\n            var userIdStr = prompt('Enter user id to borrow:');\n            if (!userIdStr)\n                return;\n            if (!/^\\d+/.test(userIdStr)) {\n                showToast('User id must be digits');\n                return;\n            }\n            var res = svc.borrow(id, Number(userIdStr));\n            showToast(res.message);\n            renderAll();\n        };\n    });\n    document.querySelectorAll('.return-btn').forEach(function (btn) {\n        btn.onclick = function () {\n            var id = btn.getAttribute('data-id');\n            var res = svc.returned(id);\n            showToast(res.message);\n            renderAll();\n        };\n    });\n    document.querySelectorAll('.delete-book').forEach(function (btn) {\n        btn.onclick = function () {\n            var id = btn.getAttribute('data-id');\n            svc.books.removeById(id);\n            svc.save();\n            renderAll();\n        };\n    });\n}\nfunction renderUsers() {\n    var users = svc.users.all();\n    el.usersList.innerHTML = users.map(function (u) { return \"\\n    <div class=\\\"d-flex justify-content-between align-items-center border rounded p-2 mb-2 bg-white\\\">\\n      <div>\".concat(u.id, \" \\u2014 <strong>\").concat(u.name, \"</strong> (borrowed: \").concat(u.borrowedCount, \")</div>\\n      <div><button data-id=\\\"\").concat(u.id, \"\\\" class=\\\"btn btn-sm btn-danger delete-user\\\">Delete</button></div>\\n    </div>\\n  \"); }).join('');\n    document.querySelectorAll('.delete-user').forEach(function (btn) {\n        btn.onclick = function () {\n            var id = Number(btn.getAttribute('data-id'));\n            svc.users.removeById(id);\n            svc.save();\n            renderAll();\n        };\n    });\n}\nfunction renderAll() {\n    renderBooks(1, 5, el.searchBooks.value);\n    renderUsers();\n}\nel.bookForm.addEventListener('submit', function (ev) {\n    ev.preventDefault();\n    var title = document.getElementById('book-title').value.trim();\n    var author = document.getElementById('book-author').value.trim();\n    var year = document.getElementById('book-year').value.trim();\n    var valid = true;\n    if (!title) {\n        valid = false;\n        document.getElementById('book-title').classList.add('is-invalid');\n    }\n    else\n        document.getElementById('book-title').classList.remove('is-invalid');\n    if (!author) {\n        valid = false;\n        document.getElementById('book-author').classList.add('is-invalid');\n    }\n    else\n        document.getElementById('book-author').classList.remove('is-invalid');\n    if (!_utils_validation__WEBPACK_IMPORTED_MODULE_3__.Validators.isYear(year)) {\n        valid = false;\n        document.getElementById('book-year').classList.add('is-invalid');\n    }\n    else\n        document.getElementById('book-year').classList.remove('is-invalid');\n    if (!valid)\n        return;\n    var id = 'b_' + Date.now();\n    var b = new _models_book__WEBPACK_IMPORTED_MODULE_0__.Book(id, title, author, Number(year));\n    svc.books.add(b);\n    svc.save();\n    document.getElementById('book-form').reset();\n    renderAll();\n    showToast('Book added');\n});\nel.userForm.addEventListener('submit', function (ev) {\n    ev.preventDefault();\n    var idStr = document.getElementById('user-id').value.trim();\n    var name = document.getElementById('user-name').value.trim();\n    var valid = true;\n    if (!_utils_validation__WEBPACK_IMPORTED_MODULE_3__.Validators.isDigits(idStr)) {\n        valid = false;\n        document.getElementById('user-id').classList.add('is-invalid');\n    }\n    else\n        document.getElementById('user-id').classList.remove('is-invalid');\n    if (!name) {\n        valid = false;\n        document.getElementById('user-name').classList.add('is-invalid');\n    }\n    else\n        document.getElementById('user-name').classList.remove('is-invalid');\n    if (!valid)\n        return;\n    var id = Number(idStr);\n    var existing = svc.users.findById(id);\n    if (existing) {\n        showToast('User with this id already exists');\n        return;\n    }\n    var u = new _models_user__WEBPACK_IMPORTED_MODULE_1__.User(id, name);\n    svc.users.add(u);\n    svc.save();\n    document.getElementById('user-form').reset();\n    renderAll();\n    showToast('User added');\n});\nel.searchBooks.addEventListener('input', function () { return renderBooks(1, 5, el.searchBooks.value); });\nrenderAll();\n\n\n//# sourceURL=webpack://lab-app/./src/app.ts?\n}");

/***/ }),

/***/ "./src/models/book.ts":
/*!****************************!*\
  !*** ./src/models/book.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Book: () => (/* binding */ Book)\n/* harmony export */ });\nvar Book = (function () {\n    function Book(id, title, author, year, isBorrowed, borrowedBy) {\n        if (isBorrowed === void 0) { isBorrowed = false; }\n        this.id = id;\n        this.title = title;\n        this.author = author;\n        this.year = year;\n        this.isBorrowed = isBorrowed;\n        this.borrowedBy = borrowedBy;\n    }\n    Book.prototype.getTitle = function () { return this.title; };\n    Book.prototype.getAuthor = function () { return this.author; };\n    Book.prototype.getYear = function () { return this.year; };\n    Book.prototype.borrow = function (userId) { this.isBorrowed = true; this.borrowedBy = userId; };\n    Book.prototype.returned = function () { this.isBorrowed = false; this.borrowedBy = undefined; };\n    return Book;\n}());\n\n\n\n//# sourceURL=webpack://lab-app/./src/models/book.ts?\n}");

/***/ }),

/***/ "./src/models/library.ts":
/*!*******************************!*\
  !*** ./src/models/library.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Library: () => (/* binding */ Library)\n/* harmony export */ });\nvar __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {\n    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {\n        if (ar || !(i in from)) {\n            if (!ar) ar = Array.prototype.slice.call(from, 0, i);\n            ar[i] = from[i];\n        }\n    }\n    return to.concat(ar || Array.prototype.slice.call(from));\n};\nvar Library = (function () {\n    function Library(initial) {\n        if (initial === void 0) { initial = []; }\n        this.items = [];\n        this.items = initial;\n    }\n    Library.prototype.add = function (item) {\n        this.items.push(item);\n    };\n    Library.prototype.removeById = function (id) {\n        this.items = this.items.filter(function (i) { return i.id !== id; });\n    };\n    Library.prototype.findById = function (id) {\n        return this.items.find(function (i) { return i.id === id; });\n    };\n    Library.prototype.search = function (predicate) {\n        return this.items.filter(predicate);\n    };\n    Library.prototype.all = function () { return __spreadArray([], this.items, true); };\n    Library.prototype.clear = function () { this.items = []; };\n    return Library;\n}());\n\n\n\n//# sourceURL=webpack://lab-app/./src/models/library.ts?\n}");

/***/ }),

/***/ "./src/models/user.ts":
/*!****************************!*\
  !*** ./src/models/user.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   User: () => (/* binding */ User)\n/* harmony export */ });\nvar User = (function () {\n    function User(id, name, borrowedCount) {\n        if (borrowedCount === void 0) { borrowedCount = 0; }\n        this.id = id;\n        this.name = name;\n        this.borrowedCount = borrowedCount;\n    }\n    User.prototype.increment = function () { this.borrowedCount++; };\n    User.prototype.decrement = function () { if (this.borrowedCount > 0)\n        this.borrowedCount--; };\n    return User;\n}());\n\n\n\n//# sourceURL=webpack://lab-app/./src/models/user.ts?\n}");

/***/ }),

/***/ "./src/services/libraryService.ts":
/*!****************************************!*\
  !*** ./src/services/libraryService.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   LibraryService: () => (/* binding */ LibraryService)\n/* harmony export */ });\n/* harmony import */ var _models_library__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/library */ \"./src/models/library.ts\");\n/* harmony import */ var _models_book__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/book */ \"./src/models/book.ts\");\n/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/user */ \"./src/models/user.ts\");\n/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./storage */ \"./src/services/storage.ts\");\n\n\n\n\nvar BOOKS_KEY = 'lab_books';\nvar USERS_KEY = 'lab_users';\nvar LibraryService = (function () {\n    function LibraryService() {\n        var booksData = _storage__WEBPACK_IMPORTED_MODULE_3__.Storage.load(BOOKS_KEY, []);\n        var usersData = _storage__WEBPACK_IMPORTED_MODULE_3__.Storage.load(USERS_KEY, []);\n        this.books = new _models_library__WEBPACK_IMPORTED_MODULE_0__.Library(booksData.map(function (b) { return Object.assign(new _models_book__WEBPACK_IMPORTED_MODULE_1__.Book('', '', '', 0), b); }));\n        this.users = new _models_library__WEBPACK_IMPORTED_MODULE_0__.Library(usersData.map(function (u) { return Object.assign(new _models_user__WEBPACK_IMPORTED_MODULE_2__.User(0, ''), u); }));\n    }\n    LibraryService.prototype.save = function () {\n        _storage__WEBPACK_IMPORTED_MODULE_3__.Storage.save(BOOKS_KEY, this.books.all());\n        _storage__WEBPACK_IMPORTED_MODULE_3__.Storage.save(USERS_KEY, this.users.all());\n    };\n    LibraryService.prototype.borrow = function (bookId, userId) {\n        var book = this.books.findById(bookId);\n        if (!book)\n            return { ok: false, message: 'Book not found' };\n        var user = this.users.findById(userId);\n        if (!user)\n            return { ok: false, message: 'User not found' };\n        if (book.isBorrowed)\n            return { ok: false, message: 'Book already borrowed' };\n        if (user.borrowedCount >= 3)\n            return { ok: false, message: 'User already has 3 books' };\n        book.borrow(user.id);\n        user.increment();\n        this.save();\n        return { ok: true, message: 'Book borrowed' };\n    };\n    LibraryService.prototype.returned = function (bookId) {\n        var book = this.books.findById(bookId);\n        if (!book)\n            return { ok: false, message: 'Book not found' };\n        if (!book.isBorrowed)\n            return { ok: false, message: 'Book is not borrowed' };\n        var user = this.users.findById(book.borrowedBy);\n        if (user)\n            user.decrement();\n        book.returned();\n        this.save();\n        return { ok: true, message: 'Book returned' };\n    };\n    return LibraryService;\n}());\n\n\n\n//# sourceURL=webpack://lab-app/./src/services/libraryService.ts?\n}");

/***/ }),

/***/ "./src/services/storage.ts":
/*!*********************************!*\
  !*** ./src/services/storage.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Storage: () => (/* binding */ Storage)\n/* harmony export */ });\nvar Storage = (function () {\n    function Storage() {\n    }\n    Storage.save = function (key, data) {\n        localStorage.setItem(key, JSON.stringify(data));\n    };\n    Storage.load = function (key, defaultValue) {\n        var raw = localStorage.getItem(key);\n        if (!raw)\n            return defaultValue;\n        try {\n            return JSON.parse(raw);\n        }\n        catch (_a) {\n            return defaultValue;\n        }\n    };\n    Storage.remove = function (key) {\n        localStorage.removeItem(key);\n    };\n    Storage.clear = function () {\n        localStorage.clear();\n    };\n    return Storage;\n}());\n\n\n\n//# sourceURL=webpack://lab-app/./src/services/storage.ts?\n}");

/***/ }),

/***/ "./src/utils/validation.ts":
/*!*********************************!*\
  !*** ./src/utils/validation.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Validators: () => (/* binding */ Validators)\n/* harmony export */ });\nvar Validators = {\n    isDigits: function (s) { return /^\\d+$/.test(s); },\n    isYear: function (s) { return /^\\d{4}$/.test(s); }\n};\n\n\n//# sourceURL=webpack://lab-app/./src/utils/validation.ts?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.ts");
/******/ 	
/******/ })()
;