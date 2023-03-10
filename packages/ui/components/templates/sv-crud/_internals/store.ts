import { ref } from 'vue'
import type { useAction } from '../../../../../web'

export const isInsertVisible = ref<boolean>(false)
export const isInsertReadonly = ref<boolean>(false)
export const isFilterVisible = ref<boolean>(false)

export const call = ref<ReturnType<typeof useAction>[0]>()
export const actionEventBus = ref<ReturnType<typeof useAction>[1]>()

export const toggleLayout = (store: any) => {
  store.currentLayout = store.currentLayout === 'tabular'
    ? store.description.layout!.name
    : 'tabular'
}
