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
