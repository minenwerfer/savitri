<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from '@savitri/web'

type Props = {
  query?: string
  param?: string
}

const slots = defineSlots()
const props = defineProps<Props>()

const source = (<any>props).query
  ? 'query'
  : 'params'

const currentTab = computed(() => {
  return router.currentRoute.value[source][props.query || props.param]
})

const router = await useRouter()

const change = (tab: string) => {
  router.push({
    [source]: {
      [props.query || props.param]: tab
    }
  })
}
</script>

<template>
  <div class="tabs">
    <div
      v-for="(slotName, index) in Object.keys($slots)"
      :key="slotName"
      :class="{
        'tabs__tab': true,
        'tabs__tab--current': slotName === currentTab
          || !currentTab && index === 0
      }"
      @click="change(slotName)"
    >
      <slot :name="slotName"></slot>
    </div>
  </div>
</template>

<style scoped src="./sv-tabs.scss"></style>

<docs>
## Example

```vue
<script setup lang="ts">
const router = await useRouter()
const section = computed<'home'|'about'|'contact'>(() => router.currentRoute.value.query.section || 'home')
</script>

<template>
  <sv-tabs query="section">
    <template #home>Home</template>
    <template #about>About</template>
    <template #contact>Contato</template>
  </sv-tabs>

  <div v-if="section === 'home'">
    Welcome!
  </div>
  
  <div v-if="section === 'about'">
    About us...
  </div>

  <div v-if="section === 'contact'">
    Contact us...
  </div>
</template>
```
</docs>
