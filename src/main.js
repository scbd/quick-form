import      { createApp   } from 'vue'
import      { createI18n  } from 'vue-i18n'
import      { createPinia } from 'pinia'
import App, { i18n        } from './index'

//'idb-message'
const anApp = createApp(App, { schemaName: 'idb-message', options: { debug: true, apiUrl: 'https://api.cbddev.xyz/api/v2023/idb/messages', accountsUrl: 'https://accounts.cbddev.xyz'} })//

anApp.use(createI18n(i18n))
anApp.use(createPinia())

anApp.mount('#app')

