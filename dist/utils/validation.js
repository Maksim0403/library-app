"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
exports.Validators = {
    isDigits: function (s) { return /^\d+$/.test(s); },
    isYear: function (s) { return /^\d{4}$/.test(s); },
    isEmail: function (s) { return /^\S+@\S+\.\S+$/.test(s); }
};
