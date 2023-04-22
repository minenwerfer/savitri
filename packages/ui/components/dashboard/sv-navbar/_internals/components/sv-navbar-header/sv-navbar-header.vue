<template>
  <div class="header">
    <sv-context-menu
      v-bind="{
        actions: dropdownActions
      }"

      style="width: 100%"
    >
      <div class="header__user">
        <sv-icon
          v-clickable
          icon-right
          name="angle-down"
          style="justify-content: space-between"
        >
          <div class="header__user-inner">
            <sv-picture
              :url="userStore.$currentUser.picture?.link" 
              class="header__user-picture"
            />
            <div>{{ userStore.$currentUser.full_name }}</div>
            <!-- <small>{{ userStore.$currentUser.roles?.join(', ') }}</small> -->
          </div>
        </sv-icon>
      </div>

      <template #extra v-if="metaStore.availableThemes">
        <sv-select
          v-model="metaStore.theme"
          @change="metaStore.saveTheme"
        >
          <option
            v-for="theme in metaStore.availableThemes"
            :value="theme"
          >
            {{ theme }}
          </option>
        </sv-select>
      </template>
    </sv-context-menu>
  </div>
</template>

<script setup lang="ts">
import { useStore, useRouter } from '@savitri/web'
import SvPicture from '../../../../../sv-picture/sv-picture.vue'
import SvIcon from '../../../../../sv-icon/sv-icon.vue'
import SvContextMenu from '../../../../../sv-context-menu/sv-context-menu.vue'
import SvSelect from '../../../../../form/sv-select/sv-select.vue'

const router = await useRouter()
const metaStore = useStore('meta')
const userStore = useStore('user')

const editProfile = () => {
  userStore.setItem(userStore.currentUser)
  router.push({ name: 'dashboard-user-profile' })
}

const dropdownActions = [
  {
    name: 'user profile',
    icon: 'house-user',
    click: () => {
      editProfile()
    }
  },
  {
    name: 'signout',
    icon: 'signout',
    click: () => {
      userStore.signout()
      router.push({ name: 'user-signin' })
    }
  }
]
</script>

<style scoped src="./sv-navbar-header.scss"></style>
