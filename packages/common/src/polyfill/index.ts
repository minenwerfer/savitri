/* eslint-disable */
Object.assign(String.prototype, {
  capitalize: function(this: string): string {
    return this.charAt(0).toUpperCase() + this.slice(1)
  },

  formatDateTime: function(this: string, locale = 'pt-BR'): string {
    return new Date(this).toLocaleDateString(locale, { timeZone: 'UTC' })
  }
})
