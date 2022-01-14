<template>
  <div :class="vertical ? 'lg:flex lg:gap-x-5' : ''">
    <sv-box :classes="`pb-0 md:pb-0 ${vertical ? 'lg:pb-5' : ''}`" v-if="titles && titles.length > 0">
      <div :class="`flex ${vertical ? 'lg:flex-col lg:gap-y-4' : ''}`">
        <slot name="menu" v-if="$slots.menu && vertical" :class="`hidden lg:block ${vertical ? menuClasses : ''}`"></slot>
        <sv-bare-button
          :class="`
            text-center py-2 border-b-4 flex-1
            ${currentTab === index+1 ? 'border-purple-600' : 'border-grey-400'}
            ${vertical ? 'lg:border-b-2 lg:text-left lg:flex-none lg:py-0' : ''}
            text-blue-500 transition-all
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
