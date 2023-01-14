<template>
  <div class="panel">
    <div
      v-if="invisibleComponents.length"
      @click="clearComponents"
    >
      {{ $t('clear') }}
    </div>
    <div>
      <div
        v-for="component in invisibleComponents"
        :key="component.binding"
      >
        <div @click="toggleComponent(component)">
          {{ $t(component.visible === true ? 'shrink' : 'restore') }}
        </div>
        <div @click="closeComponent(component)">
          {{ $t('close') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@savitri/web'

type DetachedComponent = {
  visible: boolean|'shrink'
  vnode: any
}

const metaStore = useStore('meta')
const invisibleComponents = computed(() => metaStore.detachedComponents.filter(component => component.visible))

const toggleComponent = (component: DetachedComponent) => {
  component.visible = component.visible === true
    ? 'shrink'
    : true
}

const closeComponent = (component: DetachedComponent) => {
  metaStore.detached[component.vnode.uid].visible = false
}

const clearComponents = () => {
  Object.keys(metaStore.detached).forEach((key) => {
    metaStore.detached[key].visible = false
  })

  metaStore.detachedStack.splice(0)
  metaStore.detachedItr = Math.random()
}
</script>

<style scoped src="./sv-detached-panel.scss"></style>
