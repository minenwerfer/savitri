<template>
  <div class="file">
    <div>
      <sv-picture
        v-if="isImage"
        :file="modelValue"
        class="file__image"
      ></sv-picture>
      <sv-bare-button
        v-if="(modelValue||{})._id"
        class="file__name"
        @clicked="download(modelValue._id)"
      >
        {{ modelValue.filename }}
      </sv-bare-button>
    </div>
    <input
      type="file"
      ref="file"
      @click="onClick"
      @change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@savitri/web'
import { SvBareButton, SvPicture } from '../../'

type Props = {
  modelValue: any
  context: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', result: any): void
}>()

const store = useStore('file')
const file = ref(null)

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
  const result = await store.insert({
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

<style scoped src="./sv-file.scss"></style>
