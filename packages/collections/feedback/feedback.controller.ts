import { FeedbackDocument, Feedback } from './feedback.model'
import { Mutable } from '../../api/core/controller'
import { default as Description } from './index.json'

export class FeedbackController extends Mutable<FeedbackDocument> {
  constructor() {
    super(Feedback, Description)
  }
}
