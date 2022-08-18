import Overlay from './overlay'
import Clickable from './clickable'

export default (app: any) => {
  app.directive('overlay', Overlay)
  app.directive('clickable', Clickable)
}
