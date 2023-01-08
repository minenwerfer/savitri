import { ref, computed,reactive } from 'vue'

const shortcutsVisible = ref(false)
const isShortcutsVisible = computed(() => shortcutsVisible.value)

export {
  shortcutsVisible,
  isShortcutsVisible
}

export const results = reactive({
  items: []
})
