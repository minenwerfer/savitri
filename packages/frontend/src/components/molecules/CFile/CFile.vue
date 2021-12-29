<template>
  <div class="grid">
    <img v-if="(modelValue||{})._id" :src="fileUrl" class="w-80 object-cover mb-6" />
    <input type="file" ref="file" @click="onClick" @change="onChange" />
    <c-bare-button
      v-if="(modelValue||{})._id"
      @clicked="download(modelValue._id)"
      class="text-blue-500 text-sm mt-2"
    >
      {{ modelValue.filename }}
    </c-bare-button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { CBareButton } from 'frontend/components'
import { PZ_API_URL } from 'frontend/store/module'

export default {
  components: {
    CBareButton,
  },

  props: {
    modelValue: {
      type: Object,
      required: false
    },
    context: {
      type: String,
      required: true
    },
  },

  setup(props, ctx) {

    const store = useStore()
    const file = ref(null)
    const fileUrl = computed(() => `${PZ_API_URL}/download/${(props.modelValue||{})._id}`)

    const readFile = (event) => new Promise((resolve) => {
      const fr = new FileReader()
      const [file] = event.target.files

      fr.onload = () => resolve({
        filename: file.name,
        content: fr.result,
        last_modified: file.lastModified,
        mime: file.type,
        size: file.size,
      })

      fr.readAsDataURL(file)
    })

    const onClick = () => {
      file.value = null
    }

    const onChange = async (event) => {
      const file = await readFile(event)
      const result = await store.dispatch('file/insert', {
        what: {
          ...file,
          context: props.context
        }
      })

      ctx.emit('update:modelValue', result)
    }

    const download = (filename) => {
      window.open(`${fileUrl._value}/download`)
    }

    return {
      file,
      fileUrl,
      onClick,
      onChange,
      download
    }
  }
}
</script>
