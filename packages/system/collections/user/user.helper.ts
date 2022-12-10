import { Types } from '../../../api/core/database'
import { useCollection } from '../../../api'
import type { ApiFunction } from '../../../api/types'
import type { User } from './user.description'

type SaveWithExtraProps = {
  what: Partial<User> & {
    extra: Record<string, any>
  }
}

export const userExtraModel = () => {
  return require(`${process.cwd()}/collections/userExtra/userExtra.model`).default
}

export const saveWithExtra: ApiFunction<SaveWithExtraProps> = async (props, token, ctx) => {
  const { extra } = props.what

  const UserExtra = userExtraModel()
  const userExtra = new UserExtra({
    ...extra,
    owner: new Types.ObjectId()
  })

  await userExtra.validate()
  const user = await useCollection('user', ctx).insert(props, null)

  useCollection('userExtra', ctx).insert({
    what: {
      ...extra,
      owner: user._id
    }
  }, token)

  return user
}
