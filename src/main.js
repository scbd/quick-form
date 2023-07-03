import      { createApp   } from 'vue-demi'
import      { createI18n  } from 'vue-i18n'
import      { createPinia } from 'pinia'
import App, { i18n        } from './index'

//'idb-message'
const anApp = createApp(App, { schemaName: 'idb-message', options: { debug: true, apiUrl: 'http://localhost:8000/api/v2023/idb/messages', accountsUrl: 'https://accounts.cbddev.xyz'} })//

anApp.use(createI18n(i18n))
anApp.use(createPinia())

anApp.mount('#app')

