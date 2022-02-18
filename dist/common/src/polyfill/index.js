"use strict";
/* eslint-disable */
Object.assign(String.prototype, {
    capitalize: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    formatDateTime: function (hours = false, locale = 'pt-BR') {
        return hours
            ? new Date(this).toLocaleString(locale, { timeZone: 'UTC' }).split(':').slice(0, -1).join(':')
            : new Date(this).toLocaleDateString(locale, { timeZone: 'UTC' });
    },
    formatDocument: function () {
        return this && this
            .split(/(\w{3})/).filter(_ => _).join('.')
            .replace(/\.(\w{2})$/, '-$1');
    },
    formatPhone: function () {
        return this && this
            .replace(/^0?(\w{2})/, '($1) ')
            .replace(/(\w{4})$/, '-$1');
    }
});
Object.assign(Date.prototype, {
    formatToString: function (hours = false, locale = 'pt-BR') {
        return this.toLocaleDateString(locale, { timeZone: 'UTC' });
    }
});
//# sourceMappingURL=index.js.map