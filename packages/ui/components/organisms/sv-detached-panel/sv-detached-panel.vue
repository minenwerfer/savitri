<template>
  <div class="panel-container" @click="panelVisible = true">
    {{ detachedComponents.length }}
  </div>
  <div
    class="panel"
    v-if="panelVisible"
    v-overlay.invisible="{
      click: () => panelVisible = false
    }"
  >
    <div class="panel__top">
      <div @click="clearComponents">
        {{ $t('clear') }}
      </div>
      <sv-icon
        v-clickable
        reactive
        name="multiply"
        @click="panelVisible = false"
      ></sv-icon>
    </div>
    <div class="panel__entries">
      <div
        v-for="component in detachedComponents"
        :key="component.binding"
      >
        <div v-if="component.binding" class="panel__entry-info">
          <strong>{{ component.binding.title }}</strong>
          <div v-html="component.binding.description" class="panel__entry-description"></div>
        </div>

        <div v-if="component.vnode" @click="toggleComponent(component)">
          {{ $t(component.visible === true ? 'shrink' : 'restore') }}
        </div>
        <div @click="closeComponent(component)">
          {{ $t('close') }}
        </div>
        <div @click="router.push(component.route)">
          {{ component.route }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore, DetachedComponent } from '@savitri/web'
import { SvIcon } from '../..'

const router = useRouter()
const metaStore = useStore('meta')

const panelVisible = ref(false)
const detachedComponents = computed(() => metaStore.detachedComponents.filter(component => component.visible))

const toggleComponent = (component: DetachedComponent) => {
  component.visible = component.visible === true
    ? 'shrink'
    : true
}

const closeComponent = (component: DetachedComponent) => {
  component.visible = false
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
