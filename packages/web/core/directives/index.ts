import type { App } from 'vue'

import Overlay from './v-overlay'
import Loading from './v-loading'
import Clickable from './v-clickable'
import Wizard from './v-wizard'
import Focus from './v-focus'
import Theme from './v-theme'

export default (app: App) => {
  app.directive('overlay', Overlay)
  app.directive('loading', Loading)
  app.directive('clickable', Clickable)
  app.directive('wizard', Wizard)
  app.directive('focus', Focus)
  app.directive('theme', Theme)
}
