"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integerToRoman = exports.fromEntries = exports.flatten = void 0;
/**
 * @exports @function
 * Takes a multi depth object and flattens it.
 */
function flatten(obj = {}, acc, res = {}) {
    if (Array.isArray(obj)) {
        return obj.map((e) => flatten(e));
    }
    Object.entries(obj).forEach(([key, value]) => {
        const flat = acc ? `${acc}.${key}` : key;
        if (typeof value === 'object' && !Array.isArray(value)) {
            return flatten(value, flat, res);
        }
        res[flat] = value;
    });
    return res;
}
exports.flatten = flatten;
/**
 * @exports @function
 * Transforms Object.entries() return value back into an object.
 */
function fromEntries(entries) {
    return entries
        .reduce((a, [key, value]) => ({ ...a, [key]: value }), {});
}
exports.fromEntries = fromEntries;
/**
 * @see https://www.w3resource.com/javascript-exercises/javascript-math-exercise-21.php
 */
function integerToRoman(num) {
    if (!num || num < 0) {
        return;
    }
    const digits = String(num).split('');
    const key = [
        '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
    ];
    let i = 3, roman_num = '';
    while (i--) {
        roman_num = (key[+(digits.pop() || '0') + (i * 10)] || '') + roman_num;
    }
    return Array(+digits.join('') + 1).join('M') + roman_num;
}
exports.integerToRoman = integerToRoman;
//# sourceMappingURL=index.js.map