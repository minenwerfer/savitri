<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@savitri/web'

import SvBox from '../../../../components/sv-box/sv-box.vue'
import SvForm from '../../../../components/form/sv-form/sv-form.vue'
import SvButton from '../../../../components/sv-button/sv-button.vue'
import SvPicture from '../../../../components/sv-picture/sv-picture.vue'
import SvIcon from '../../../../components/sv-icon/sv-icon.vue'

const userStore = useStore('user')
const metaStore = useStore('meta')

const editPanel = ref(false)

userStore.setItem(userStore.$currentUser)

const insert = async () => {
  await userStore.insert({ what: userStore.item })
  sessionStorage.setItem('auth:currentUser', JSON.stringify(userStore.item))

  metaStore.spawnModal({
    title: 'Feito!',
    body: 'Suas informações foram salvas'
  })
}
</script>

<template>
  <div class="sv-centered">
    <sv-picture
      bordered
      :url="userStore.item.picture?.link"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 14rem;
        height: 14rem;
      "
    >
      <template #caption>
        <sv-icon
          v-clickable
          small
          icon-right
          name="edit"
          @click="editPanel = true"
        >
          <h2>{{ userStore.item.full_name }}</h2>
        </sv-icon>
      </template>
    </sv-picture>
  </div>

  <sv-box
    float
    close-hint
    title="Editar perfil"
    v-model:visible="editPanel"
    @overlay-click="editPanel = false"
  >
    <sv-form
      v-bind="{
        collection: 'user',
        form: userStore.useProperties([
          'full_name',
          'email',
          'phone',
          'picture'
        ]),
        formData: userStore.item,
        layout: userStore.formLayout
      }"
    ></sv-form>

    <template #footer>
      <sv-button
        :loading="userStore.isLoading"
        @click="insert"
      >
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

<style scoped src="./profile.scss"></style>
