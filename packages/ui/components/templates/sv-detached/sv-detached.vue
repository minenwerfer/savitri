<template>
  <div class="detached" v-if="metaStore.detachedItr">
    <div
      v-for="({ vnode }) in metaStore.detachedComponents.filter(component => component.visible === true)"
      :key="vnode.props.uid"
      :class="{
        'detached__component': true,
        'detached__component--shadowed': metaStore.detachedStack[0] !== vnode.props.uid
      }"
    >
      <component
        v-draggable
        v-bind="{
          _detached: true
        }"

        :is="vnode"
        @mousedown="metaStore.detachedStack.unshift(vnode.props.uid)"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'

const metaStore = useStore('meta')
</script>

<style scoped src="./sv-detached.scss"></style>
