"use strict";
/* eslint-disable */
Object.assign(String.prototype, {
    capitalize: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    formatDateTime: function (hours = false, locale = 'pt-BR') {
        return hours
            ? new Date(this).toLocaleString(locale, { timeZone: 'UTC' })
            : new Date(this).toLocaleDateString(locale, { timeZone: 'UTC' });
    }
});
Object.assign(Date.prototype, {
    formatToString: function (hours = false, locale = 'pt-BR') {
        return this.toLocaleDateString(locale, { timeZone: 'UTC' });
    }
});
//# sourceMappingURL=index.js.map