import { FeedbackDocument, Feedback } from './feedback.mdl'
import { default as Description } from './index.json'
import { Mutable } from '../../src/controller'

export class FeedbackController extends Mutable<FeedbackDocument> {
  constructor() {
    super(Feedback, Description)
  }
}
