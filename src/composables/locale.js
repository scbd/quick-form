import { getUnLocale } from '@houlagins/locale'


export default () => scbdCMSLocale() || getUnLocale()


function scbdCMSLocale(){
  if(typeof window === 'undefined') return ''

  const pref = window.document.cookie.replace(/(?:(?:^|.*;\s*)Preferences\s*=\s*([^;]*).*$)|^.*$/, '$1')

  if(pref) return (pref.replace('Locale=', ''))

  return ''
}