"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(id, name, email, borrowedCount) {
        if (borrowedCount === void 0) { borrowedCount = 0; }
        this.id = id;
        this.name = name;
        this.email = email;
        this.borrowedCount = borrowedCount;
    }
    User.prototype.increment = function () { this.borrowedCount++; };
    User.prototype.decrement = function () { if (this.borrowedCount > 0)
        this.borrowedCount--; };
    return User;
}());
exports.User = User;
