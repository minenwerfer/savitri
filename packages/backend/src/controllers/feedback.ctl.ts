import { FeedbackDocument, Feedback, Description } from '../models/Feedback'
import { Mutable } from './abstract/Mutable'

export class FeedbackController extends Mutable<FeedbackDocument> {
  constructor() {
    super(Feedback, Description)
  }
}
