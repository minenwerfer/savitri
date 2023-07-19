import type { LayoutName } from '@semantic-api/types'
import SvTabular from './sv-tabular/sv-tabular.vue'
import SvGrid from './sv-grid/sv-grid.vue'

export const getLayout = (layoutName: LayoutName) => {
  const defaultLayouts = {
    tabular: SvTabular,
    grid: SvGrid
  }

  return defaultLayouts[layoutName] || defaultLayouts.tabular
}
