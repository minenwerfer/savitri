import { FeedbackDocument, Feedback } from './feedback.model'
import { default as Description } from './index.json'
import { Mutable } from '../../core/controller'

export class FeedbackController extends Mutable<FeedbackDocument> {
  constructor() {
    super(Feedback, Description)
  }
}
