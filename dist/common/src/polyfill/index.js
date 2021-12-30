"use strict";
/* eslint-disable */
Object.assign(String.prototype, {
    capitalize: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    formatDateTime: function (locale = 'pt-BR') {
        return new Date(this).toLocaleDateString(locale, { timeZone: 'UTC' });
    }
});
//# sourceMappingURL=index.js.map