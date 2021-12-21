<template>
  <div class="overflow-hidden">
    <div v-if="titles && titles.length > 0" class="flex mb-8">
      <c-bare-button
        :class="`
        ${currentTab === index+1 ? 'border-purple-600' : 'border-grey-400'}
        flex-grow
        text-blue-500
        transition-all
        text-center
        py-2 border-b-4
        `"
        v-for="(title, index) in titles"
        :key="`tabtitle-${index}`"

        @clicked="$emit('update:currentTab', index+1)"
      >
        {{ title }}
      </c-bare-button>
    </div>
    <div>
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
