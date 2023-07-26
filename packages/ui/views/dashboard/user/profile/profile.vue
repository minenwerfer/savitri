<script setup lang="ts">
import { ref } from 'vue'
import { useStore, useRouter } from '@savitri/web'

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
  userStorage.setItem('auth:currentUser', JSON.stringify(userStore.item))

  metaStore.spawnModal({
    title: 'Feito!',
    body: 'Suas informações foram salvas'
  })
}

const signout = async () => {
  await userStore.signout()
  const router = await useRouter()
  router.push('/user/signin')
}
</script>

<template>
  <div>
    <sv-picture
      v-bind="{
        width: '14rem',
        height: '14rem'
      }"

      bordered
      :url="userStore.item.picture?.link"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
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

        <menu class="profile__menu">
          <slot
            v-if="$slots['user-profile-menu']"
            name="user-profile-menu"
          ></slot>

          <sv-icon
            v-clickable
            name="key-skeleton"
            @click="$router.push('/dashboard/user/changepass')"
          >
            Mudar senha
          </sv-icon>
          <sv-icon
            v-clickable
            name="signout"
            @click="signout"
          >
            Sair
          </sv-icon>
        </menu>
      </template>
    </sv-picture>
  </div>

  <slot
    v-if="$slots['user-profile']"
    name="user-profile"
  ></slot>

  <sv-box
    float
    close-hint
    title="Editar perfil"
    v-model="editPanel"
    @overlay-click="editPanel = false"
  >
    <sv-form
      v-model="userStore.item"
      v-bind="{
        collection: 'user',
        form: userStore.useProperties([
          'full_name',
          'email',
          'phone',
          'picture'
        ]),
        layout: userStore.formLayout
      }"
    ></sv-form>

    <template #footer>
      <sv-button
        :loading="userStore.loading.insert"
        @click="insert"
      >
        Salvar
      </sv-button>
    </template>
  </sv-box>
</template>

<style scoped src="./profile.scss"></style>
