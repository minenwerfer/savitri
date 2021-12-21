<template>
  <div class="grid">
    <div class="flex gap-x-2 justify-self-end">
      <div class="self-center">
        Página
      </div>
      <c-select @change="paginate(+$event.target.value)">
        <option
          v-for="page in pageCount"
          :key="`page-${page}`"
        >
          {{ page }}
        </option>
      </c-select>
    </div>
  </div>
</template>

<script>
import { computed, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import { CSelect } from 'frontend/components'

export default {
  props: {
    module: {
      type: String,
      required: true,
    }
  },

  components: {
    CSelect,
    CBareButton: defineAsyncComponent(() => import('frontend/components/atoms/CBareButton/CBareButton.vue')),
  },

  methods: {
    paginate(page) {
      console.log({ page })
      this.store.dispatch(`${this.module}/paginate`, page)
    }
  },

  setup(props) {
    const store = useStore()
    return {
      store,
      pageCount: computed(() => store.getters[`${props.module}/pageCount`]),
      currentPage: computed(() => store.getters[`${props.module}/currentPage`]),
    }
  }
}
</script>
