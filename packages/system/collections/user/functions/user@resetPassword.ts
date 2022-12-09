import type { CollectionFunction } from '../../../../api/types'

type Props = {
  email: string
}

const resetPassword: CollectionFunction<Props> = (props) => {
  return {
    email: props.email
  }
}

export default resetPassword
