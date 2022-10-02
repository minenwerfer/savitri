<template>
  <div class="file">
    <div v-if="preview || modelValue?._id">
      <sv-picture
        v-if="isImage"
        v-model="previewFile"
        class="file__image"
      ></sv-picture>
      <div
        v-clickable
        v-if="modelValue?._id"
        class="file__name"
        @click="download(modelValue._id)"
      >
        {{ modelValue.filename }}
      </div>
    </div>
    <div class="file__actions">
      <input
        type="file"
        ref="file"
        @change="changePreview"
      />
      <div
        v-if="preview"
        class="file__buttons"
      >
        <sv-button @clicked="insert">
          Enviar
        </sv-button>
        <sv-button @clicked="clearPreview">
          Limpar
        </sv-button>
      </div>
      <div
        v-else-if="modelValue?._id"
        class="file__buttons"
      >
        <sv-button @clicked="remove">
          Remover
        </sv-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import { useStore } from '@savitri/web'
import { SvPicture, SvButton } from '../..'

type Props = {
  modelValue: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const fileStore = useStore('file')
provide('buttonSize', 'small')

const preview = ref(null)
const previewFile = computed(() =>
  preview.value
    ? URL.createObjectURL(preview.value)
    : props.modelValue?.link
)

const isImage = computed(() => 
  [
    preview.value?.type,
    props.modelValue?.mime
  ].some((type: string) => /^image\//.test(type))
)

const readFile = (file: any): Promise<any> => new Promise((resolve) => {
  const fr = new FileReader()

  fr.onload = () => resolve({
    filename: file.name,
    content: fr.result,
    last_modified: file.lastModified,
    mime: file.type,
    size: file.size,
  })

  fr.readAsDataURL(file)
})

const changePreview = (event) => {
  preview.value = event.target.files[0]
}

const clearPreview = () => {
  preview.value = null
}

const insert = async () => {
  const file = await readFile(preview.value)
  const result = await fileStore.insert({
    what: {
      _id: props.modelValue?._id,
      ...file
    }
  })

  clearPreview()
  emit('update:modelValue', result)
}

const remove = async () => {
  await fileStore.delete({
    filters: {
      _id: props.modelValue._id
    }
  })

  emit('update:modelValue', {})
}

const download = (filename: string) => {
  window.open(`${fileUrl.value}/download`)
}
</script>

<style scoped src="./sv-file.scss"></style>
