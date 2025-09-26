"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
var Storage = /** @class */ (function () {
    function Storage() {
    }
    Storage.save = function (key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    };
    Storage.load = function (key, defaultValue) {
        var raw = localStorage.getItem(key);
        if (!raw)
            return defaultValue;
        try {
            return JSON.parse(raw);
        }
        catch (_a) {
            return defaultValue;
        }
    };
    Storage.remove = function (key) {
        localStorage.removeItem(key);
    };
    Storage.clear = function () {
        localStorage.clear();
    };
    return Storage;
}());
exports.Storage = Storage;
