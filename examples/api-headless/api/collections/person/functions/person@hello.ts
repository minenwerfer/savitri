import { ApiFunction } from '@savitri/api'

type Props = {
  name: string
}

const hello: ApiFunction<Props> = (props) => {
  return {
    message: `Hello, ${props.name}!`
  }
}

export default hello
