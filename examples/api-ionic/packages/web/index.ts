import { useApp, AppOptions } from '@savitri/web'
import { IonicVue } from '@ionic/vue'
import '@savitri/addon-tailwind/boot.css'
import '@savitri/ui/scss/main.scss'
import '@ionic/vue/css/core.css'

import CMain from './main.vue'
import CInput from './components/form/c-input.vue'
import CSelect from './components/form/c-select.vue'
import CSwitch from './components/form/c-switch.vue'

const options: AppOptions = {
  component: CMain,
}

const customComponents = {
  input: CInput,
  select: CSelect,
  switch: CSwitch
}

useApp(options).then(({ app }) => {
  app.provide('formComponents', customComponents)
  app.provide('omitInputLabels', true)

  app.use(IonicVue)
  app.mount('#app')
})
