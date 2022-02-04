<template>
  <div :class="vertical ? 'lg:flex lg:gap-x-4' : ''">
    <sv-box :class="vertical ? 'lg:w-1/6' : ''" classes="w-screen md:w-auto lg:w-full" v-if="titles && titles.length > 0" :padding-y="`pt-2 lg:pt-2 ${vertical ? 'lg:py-5' : ''}`">
      <div :class="`flex gap-x-4 w-full whitespace-nowrap overflow-scroll ${vertical ? 'lg:flex-col lg:gap-y-4' : ''}`">
        <slot name="menu" v-if="$slots.menu && vertical" :class="`hidden lg:block ${vertical ? menuClasses : ''}`"></slot>
        <sv-bare-button
          :class="`
            text-center text-blue-500
            py-2 flex-1
            ${currentTab === index+1 ? 'font-semibold' : ''}
            ${vertical ? 'lg:border-b-2 lg:text-left lg:flex-none lg:py-0' : ''}
            transition-all whitespace-nowrap
          `"
          v-for="(title, index) in titles"
          :key="`tabtitle-${index}`"

          @clicked="$emit('update:currentTab', index+1)"
        >
          {{ title }}
        </sv-bare-button>
      </div>
    </sv-box>

    <div :class="vertical ? 'lg:flex-1' : ''">
      <div
        v-for="tab in tabs"
        :key="`tab-${tab}`"
      >
        <div v-if="tab === currentTab" class="animate-fade">
          <slot :name="`tab-${tab}`"></slot>
        </div>
      </div>

      <div class="flex gap-x-2" v-if="bottomHelpers">
        <sv-button @clicked="previous" :disabled="currentTab === 1">Voltar</sv-button>
        <sv-button @clicked="next" :disabled="currentTab === tabs" v-if="!finishButton || currentTab !== tabs">Próximo</sv-button>
        <sv-button @clicked="$emit('finish')" v-else-if="currentTab === tabs">Finalizar</sv-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SvBareButton, SvButton, SvBox } from 'frontend/components'

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
  }
})

const emit = defineEmits<{
  (e: 'update:currentTab', event: number): void
}>()

const previous = () => {
  const previousTab = props.currentTab === 1 ? props.tabs : props.currentTab - 1;
  emit('update:currentTab', previousTab)
}

const next = () => {
  const nextTab = props.currentTab === props.tabs ? 1 : props.currentTab + 1
  emit('update:currentTab', nextTab)
}
</script>
