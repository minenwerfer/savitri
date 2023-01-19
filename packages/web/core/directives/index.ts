import Overlay from './v-overlay'
import Loading from './v-loading'
import Clickable from './v-clickable'
import Wizard from './v-wizard'
import Detachable from './v-detachable'
import Draggable from './v-draggable'

export default (app: any) => {
  app.directive('overlay', Overlay)
  app.directive('loading', Loading)
  app.directive('clickable', Clickable)
  app.directive('wizard', Wizard)
  app.directive('detachable', Detachable)
  app.directive('draggable', Draggable)
}
