import   component    from './index.vue'
import { pascalCase } from 'change-case'
import { name       } from '../package.json'
import i18nOptions    from './locales'

const NAME =  pascalCase(name.replace('@scbd/', 'SCBD-'))

export function install(Vue){
  if (install.installed) return
  
  install.installed = true
  
  Vue.component(NAME, component)
}

export const i18n   = i18nOptions
export const plugin = { install, NAME }

export default component