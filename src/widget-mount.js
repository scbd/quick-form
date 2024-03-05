import { createApp   } from 'vue'
import { createI18n  } from 'vue-i18n'
import { createPinia } from 'pinia'
import   component, { i18n }   from '@scbd/quick-form'

const { rootProps } = window?.chm?.scbdQuickForm || {}
const { search }    = new URL(import.meta.url)
const   mountId     = search.replace("?", "#")


createApp(component, rootProps)
.use(createI18n(i18n))
.use(createPinia())
.mount(mountId)