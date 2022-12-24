import type { ApiFunction } from '@savitri/api'
import type { Person } from '../person.description'

type Props = Pick<Person,
  'name'
  | 'job'
>

const hello: ApiFunction<Props> = (props) => {
  // we don't provide runtime props validation
  // do it yourself or use an external library like zod
  if( !props.name  || !props.job) {
    throw new TypeError(
      `please provide name and job`
    )
  }

  const treatment = (() => {
    switch( props.job ) {
      case 'doctor': return 'Dr.'
      default: return 'Mr.'
    }
  })()

  return {
    message: `Hello, ${treatment} ${props.name}!`
  }
}

export default hello
