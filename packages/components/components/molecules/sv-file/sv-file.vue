<template>
  <div class="grid gap-y-1">
    <div>
      <img v-if="isImage" :src="fileUrl" class="w-80 object-cover border" />
      <sv-bare-button
        v-if="(modelValue||{})._id"
        @clicked="download(modelValue._id)"
        class="text-blue-500 text-sm mt-2"
      >
        {{ modelValue.filename }}
      </sv-bare-button>
    </div>
    <div>
      <input type="file" ref="file" @click="onClick" @change="onChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useFile } from '../../../../frontend'
import { SvBareButton } from '../../'

const props = defineProps<{
  modelValue: any
  context: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', result: any): void
}>()

const store = useStore()
const file = ref(null)

const fileUrl = computed(() => useFile(props.modelValue).link)
const isImage = computed(() => /^image\//.test((props.modelValue||{}).mime))

const readFile = (event: any): Promise<any> => new Promise((resolve) => {
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

const onChange = async (event: any) => {
  const file = await readFile(event)
  const result = await store.dispatch('file/insert', {
    what: {
      ...file,
      context: props.context
    }
  })

  emit('update:modelValue', result)
}

const download = (filename: string) => {
  window.open(`${fileUrl.value}/download`)
}
</script>
