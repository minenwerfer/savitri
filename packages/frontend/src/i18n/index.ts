import { createI18n } from 'vue-i18n'

const __defaultLocales = [
  'pt_BR'
]

export const useI18n = (options:any) => {
  if( options ) {
    const messages = options.messages

    __defaultLocales.forEach((locale:string) => {
      if( locale in messages ) {
        messages[locale] = {
          ...messages[locale],
          ...require(`../../i18n/${locale}/index.json`)
        }
      }
    })

    return createI18n({
      ...options,
      messages
    })
  }

  return createI18n({
    locale: 'pt_BR',
    messages: {
      pt_BR: require('../../i18n/pt_BR/index.json')
    }
  })
}
