/* eslint-disable */

Object.assign(String.prototype, {
  capitalize: function(this: string): string {
    return this.charAt(0).toUpperCase() + this.slice(1)
  },

  formatDateTime: function(this: string, hours: boolean = false, locale = 'pt-BR'): string {
    return hours
      ? new Date(this).toLocaleString(locale, { timeZone: 'UTC' }).split(':').slice(0, -1).join(':')
      : new Date(this).toLocaleDateString(locale, { timeZone: 'UTC' })
  }
})

Object.assign(Date.prototype, {
  formatToString: function(this: Date, hours: boolean = false, locale = 'pt-BR'): string {
    return this.toLocaleDateString(locale, { timeZone: 'UTC' })
  }
})
