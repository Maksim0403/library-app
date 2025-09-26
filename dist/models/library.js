"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
var Library = /** @class */ (function () {
    function Library(initial) {
        if (initial === void 0) { initial = []; }
        this.items = [];
        this.items = initial;
    }
    Library.prototype.add = function (item) {
        this.items.push(item);
    };
    Library.prototype.removeById = function (id) {
        this.items = this.items.filter(function (i) { return i.id !== id; });
    };
    Library.prototype.findById = function (id) {
        return this.items.find(function (i) { return i.id === id; });
    };
    Library.prototype.search = function (predicate) {
        return this.items.filter(predicate);
    };
    Library.prototype.all = function () { return __spreadArray([], this.items, true); };
    Library.prototype.clear = function () { this.items = []; };
    return Library;
}());
exports.Library = Library;
