<template>
  <div :class="`
    tabbed
    ${vertical && 'tabbed--vertical'}
  `">
    <sv-box
      fill
      v-if="titles && titles.length > 0"
    >
      <div :class="`
        tabbed__menu
        ${vertical && 'tabbed__menu--vertical'}
      `">
        <slot
          v-if="$slots.menu && vertical"
          name="menu"
          class="hidden xl:block"
        ></slot>
        <sv-bare-button
          v-for="(title, index) in titles"
          :key="`tabtitle-${index}`"

          :class="`
            tabbed__menu-button
            ${currentTab === index && 'tabbed__menu-button--active'}
            ${vertical && 'tabbed__menu-button--vertical'}
          `"

          @clicked="$emit('update:currentTab', index)"
        >
          {{ title }}
        </sv-bare-button>
      </div>
    </sv-box>

    <div class="tabbed__content">
      <div
        v-for="([key, value], tab) in Object.entries($slots)"
        :key="`tab-${key}`"
      >
        <slot
          v-if="tab == currentTab"
          :name="key"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { SvBareButton, SvBox } from '../..'

type Props = {
  currentTab: number
  titles?: Array<string>
  vertical?: boolean
  updateRoute?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  updateRoute: true
})

const emit = defineEmits<{
  (e: 'update:currentTab', event: number): void
}>()

if( props.updateRoute ) {
  const router = useRouter()
  const route = useRoute()

  const updateTab = (() => {
    if( route.hash ) {
      emit('update:currentTab', Number(route.hash.slice(1)))
    }
  })

  watch(() => route.hash, updateTab)

  watch(() => props.currentTab, (v: string) => {
    if( route.hash !== `#${v}` ) {
      router.push({ hash: `#${v}` })
    }
  })

  onMounted(updateTab)
}
</script>

<style scoped src="./sv-tabbed.scss"></style>
