import type { App } from 'vue'
import Overlay from './overlay'

export default (app: App) => {
  app.directive('overlay', Overlay)
}
