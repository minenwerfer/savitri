<template>
  <div class="detached" v-if="metaStore.detachedItr">
    <div
      v-for="({ vnode, binding }) in metaStore.detachedComponents"
      :key="binding"
      :class="{
        'detached__shadowed': metaStore.detachedStack[0] !== vnode.ctx.uid
      }"
    >
      <component
        v-draggable
        v-bind="{
          _detached: true
        }"

        :is="vnode"
        @mousedown="metaStore.detachedStack.unshift(vnode.ctx.uid)"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@savitri/web'

const metaStore = useStore('meta')
</script>

<style scoped src="./sv-detached.scss"></style>
