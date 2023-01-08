import Overlay from './v-overlay'
import Loading from './v-loading'
import Clickable from './v-clickable'
import Wizard from './v-wizard'

export default (app: any) => {
  app.directive('overlay', Overlay)
  app.directive('loading', Loading)
  app.directive('clickable', Clickable)
  app.directive('wizard', Wizard)
}
