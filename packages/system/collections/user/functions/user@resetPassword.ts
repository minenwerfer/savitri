import type { ApiFunction } from '../../../../api/types'

type Props = {
  email: string
}

const resetPassword: ApiFunction<Props> = (props) => {
  return {
    email: props.email
  }
}

export default resetPassword
