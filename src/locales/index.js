import getLocale from '../composables/locale.js'
import messages from './messages'

export default {
  legacy: false,
  locale        : getLocale(),
  fallbackLocale: 'en',
  useScope      : 'global',
  messages
}
