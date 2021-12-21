import { createI18n } from 'vue-i18n'

export const useI18n = (options:any) => {
  if( options ) {
    const messages = Object.entries(options.messages)
    .reduce((a, [key, value]: [string, any]) => ({

      [key]: {
        ...value,
        ...require(`data/i18n/${key}/index.json`)
      }

    }), {})

    return createI18n({
      ...options,
      messages
    })
  }

  return createI18n({
    locale: 'pt_BR',
    messages: {
      pt_BR: require(`data/i18n/pt_BR/index.json`)
    }
  })
}
