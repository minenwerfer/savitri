  export const getIndexes = (description: any, key: string, form: boolean = false): any => {

    const [_, reference]: any = Object.entries(description.fields||{})
      .find(([k]: [string, unknown]) => key === k)||[,]

    const query:any = {}

    // retrieves index if dynamic querying is used
    if( reference?.values ) {

      // values can be either arrays or objects
      const prop = Array.isArray(reference.values)
        ? reference.values.find((e: any) => Object.keys(e)[0] === '__query')?.__query
        : reference.values.__query

      Object.assign(query, prop||{})
    }

    const { module, index, formIndex } = query.module ? query : (reference||{})
    if( !module ) {
      return
    }

    const field = (form ? (formIndex || index) : index) || Object.keys(description.fields)[0]
    return Array.isArray(field) ? field : [field]
  }
