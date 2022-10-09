export default (
  subject: any,
  condition: {
    operator: string
    term1: string
    term2: any
    else: any
  }
) => {
  const {
    operator,
    term2
  } = condition

  const result = {
    satisfied: false,
    else: null
  }

  const term1 = subject[condition.term1]

  const satisfied = result.satisfied = (() => {
    switch( operator ) {
      case 'equal': return term1 === term2
      case 'unequal': return term1 !== term2
      case 'in': return term2.includes(term1)
    }
  })()

  if( !satisfied ) {
    result.else  = condition.else
  }

  return result
}
