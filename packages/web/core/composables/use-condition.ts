export type Condition = {
  operator: string
  term1: string
  term2: string
  else?: any
}

export const useCondition = (subject: any, condition: Condition) => {
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
      default: return false;
    }
  })()

  if( !satisfied ) {
    result.else  = condition.else
  }

  return result
}
