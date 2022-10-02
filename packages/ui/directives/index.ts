import Overlay from './overlay'
import Loading from './loading'
import Clickable from './clickable'

export default (app: any) => {
  app.directive('overlay', Overlay)
  app.directive('loading', Loading)
  app.directive('clickable', Clickable)
}
