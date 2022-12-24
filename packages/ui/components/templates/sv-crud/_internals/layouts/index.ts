import type { Layout } from '../../../../../../types'
import SvTabular from './sv-tabular/sv-tabular.vue'
import SvGrid from './sv-grid/sv-grid.vue'

export const getLayout = (layout: Layout) => {
  const defaultLayouts = {
    tabular: SvTabular,
    grid: SvGrid
  }

  return defaultLayouts[layout?.name] || defaultLayouts.tabular
}
