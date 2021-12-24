<template>
  <div :class="vertical ? 'md:flex md:gap-x-4' : ''">
    <div
      v-if="titles && titles.length > 0"
      :class="`flex bg-white rounded-lg shadow-md mb-4 pt-2 ${vertical ? 'md:flex-col md:border-r md:py-4' : ''}`"
    >
      <c-bare-button
        :class="`
        text-center py-2 border-b-4 flex-1
        ${currentTab === index+1 ? 'border-purple-600' : 'border-grey-400'}
        ${vertical ? 'md:border-b-2 md:mb-4 md:px-4 md:text-left md:flex-none md:py-0' : ''}
        text-blue-500
        transition-all
        `"
        v-for="(title, index) in titles"
        :key="`tabtitle-${index}`"

        @clicked="$emit('update:currentTab', index+1)"
      >
        {{ title }}
      </c-bare-button>
    </div>

    <div :class="vertical ? 'md:flex-1' : ''">
      <div
        v-for="tab in tabs"
        :key="`tab-${tab}`"
      >
        <div v-if="tab === currentTab" class="animate-fade">
          <slot :name="`tab-${tab}`"></slot>
        </div>
      </div>

      <div class="flex gap-x-2" v-if="bottomHelpers">
        <c-button @clicked="previous" :disabled="currentTab === 1">Voltar</c-button>
        <c-button @clicked="next" :disabled="currentTab === tabs" v-if="!finishButton || currentTab !== tabs">Próximo</c-button>
        <c-button @clicked="$emit('finish')" v-else-if="currentTab === tabs">Finalizar</c-button>
      </div>
    </div>
  </div>
</template>

<script>
import { CBareButton, CButton } from 'frontend/components'

export default {
  components: {
    CBareButton,
    CButton,
  },
  props: {
    tabs: {
      type: Number,
      required: true,
    },
    titles: {
      type: Array,
      required: false,
      validator: value => value.every(v => typeof v === 'string')
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
    }
  },
  methods: {
    previous() {
      const previousTab = this.currentTab === 1 ? this.tabs : this.currentTab - 1;
      this.$emit('update:currentTab', previousTab)
    },
    next() {
      const nextTab = this.currentTab === this.tabs ? 1 : this.currentTab + 1
      this.$emit('update:currentTab', nextTab)
    },
  },
}
</script>
