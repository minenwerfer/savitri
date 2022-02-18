"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyToClipboard = void 0;
const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
};
exports.copyToClipboard = copyToClipboard;
//# sourceMappingURL=index.js.map