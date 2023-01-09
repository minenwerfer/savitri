<template>
  <div class="file">
    <div v-if="preview || modelValue?._id">
      <sv-picture
        v-if="isImage"
        v-model="previewFile"
        class="file__image"
      ></sv-picture>
      <a
        v-if="modelValue?._id"
        :href="modelValue.download_link"
      >
        {{ modelValue.filename }}
      </a>
    </div>
    <div class="file__actions">
      <input
        type="file"
        ref="file"
        :accept="property.s$accept?.join(',')"
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
import type { CollectionProperty } from '@semantic-api/types'
import { useStore } from '../../../../web'
import { SvPicture, SvButton } from '../..'

type Props = {
  modelValue: any
  property: CollectionProperty
  propertyName?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const fileStore = useStore('file')
provide('buttonSize', 'small')

const preview = ref<({ type: string }&Blob)|null>(null)

const previewFile = computed(() =>
  preview.value
    ? URL.createObjectURL(preview.value)
    : props.modelValue?.link
)

const isImage = computed(() => 
  (/^image\//.test(props.modelValue?.mime) && !preview.value?.type)
    || /^image\//.test(preview.value?.type!)
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

const changePreview = (event: any) => {
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
</script>

<style scoped src="./sv-file.scss"></style>
