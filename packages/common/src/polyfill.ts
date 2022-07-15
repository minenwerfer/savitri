/* eslint-disable */

Object.assign(String.prototype, {
  capitalize: function(this: string): string {
    return this.charAt(0).toUpperCase() + this.slice(1)
  },

  formatDateTime: function(this: string, hours: boolean = false, locale = 'pt-BR'): string {
    return hours
      ? new Date(this).toLocaleString(locale, { timeZone: 'UTC' }).split(':').slice(0, -1).join(':')
      : new Date(this).toLocaleDateString(locale, { timeZone: 'UTC' })
  },

  formatDocument: function(this: string) {
    return this && this
      .split(/(\w{3})/).filter(_ => _).join('.')
      .replace(/\.(\w{2})$/, '-$1')
  },

  formatPhone: function(this: string) {
    return this && this
      .replace(/^0?(\w{2})/, '($1) ')
      .replace(/(\w{4})$/, '-$1')
  }
})

Object.assign(Date.prototype, {
  formatToString: function(this: Date, hours: boolean = false, locale = 'pt-BR'): string {
    return this.toLocaleDateString(locale, { timeZone: 'UTC' })
  },

  daysAgo: function(this: Date, days: number): Date {
    const d = new Date()
    d.setDate(this.getDate() - days)
    return d
  }
})
