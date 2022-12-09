import { Types } from '../../../api/core/database'
import { getController } from '../../../api/core/controller'

export const userExtraModel = () => {
  return require(`${process.cwd()}/collections/userExtra/userExtra.model`).default
}

export const saveWithExtra = async (props: { what: any }) => {
  const { extra } = props.what

  const UserExtra = userExtraModel()
  const userExtra = new UserExtra({
    ...extra,
    owner: new Types.ObjectId()
  })

  await userExtra.validate()
  const user = await super.insert.call(this, props)

  /**
   * For the future reference: I decided to call Mutable.insert instead of
   * Model.create because with the former way user can set userExtra access
   * control and guards.
   */
  const userExtraInstance = new (getController('userExtra'))
  userExtraInstance.injected = this.injected

  await userExtraInstance.insert({
    what: {
      ...extra,
      owner: user._id
    }
  })

  return user
}
