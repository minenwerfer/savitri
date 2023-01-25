import Overlay from './v-overlay'
import Loading from './v-loading'
import Clickable from './v-clickable'
import Wizard from './v-wizard'
import Subscribable from './v-subscribable'
import Draggable from './v-draggable'
import Focus from './v-focus'
export * from './v-subscribable'

export default (app: any) => {
  app.directive('overlay', Overlay)
  app.directive('loading', Loading)
  app.directive('clickable', Clickable)
  app.directive('wizard', Wizard)
  app.directive('subscribable', Subscribable)
  app.directive('draggable', Draggable)
  app.directive('focus', Focus)
}
