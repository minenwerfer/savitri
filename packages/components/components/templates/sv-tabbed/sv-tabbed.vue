<template>
  <div :class="`tabbed ${vertical && 'tabbed--vertical'}`">
    <sv-box
      v-if="titles && titles.length > 0"
      :fill="true"
    >
      <div :class="`tabbed__menu ${vertical && 'tabbed__menu--vertical'}`">
        <slot
          name="menu"
          v-if="$slots.menu && vertical"
          :class="`hidden xl:block ${vertical ? menuClasses : ''}`"
        ></slot>
        <sv-bare-button
          :class="`
            tabbed__menu-button
            ${currentTab === index && 'tabbed__menu-button--active'}
            ${vertical && 'tabbed__menu-button--vertical'}
          `"
          v-for="(title, index) in titles"
          :key="`tabtitle-${index}`"

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

const props: any = defineProps({
  tabs: {
    type: Number,
    required: true,
  },
  titles: {
    type: Array,
    required: false,
    validator: (value: any) => value.every((v: any) => typeof v === 'string')
  },
  currentTab: {
    type: Number,
    required: true,
  },
  bottomHelpers: {
    type: Boolean,
    default: true,
  },
  finishButton: {
    type: Boolean,
    default: true,
  },
  vertical: {
    type: Boolean,
    default: false
  },
  menuClasses: {
    type: String,
    default: ''
  },
  updateRoute: {
    type: Boolean,
    default: true
  }
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
