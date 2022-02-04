import { FeedbackDocument, Feedback, Description } from '../models/Feedback'
import { Mutable } from './abstract/Mutable'

export class FeedbackController extends Mutable<FeedbackDocument> {
  constructor() {
    super(Feedback, Description)
  }

  public override insert(props: { what: FeedbackDocument }, response: unknown, decodedToken: any) {
    props.what.user_id = decodedToken._id
    return super.insert.call(this, props, response, decodedToken)
  }
}
