import { defineStore } from 'pinia'
import { createApp   } from 'vue'
import { isServer    } from '../ssr'
import   AuthIframe    from './iframe.vue'

const actions = { isAccountsUrl, isAccountsOrigin, receivePostMessage, loadingInterval,  createIframe, getIframe, useIframe, loadIframe, getToken }

export const useAuthStore = defineStore('auth', { state, actions })

const initState = {
                    accountsUrl : '',
                    token       : '',
                    email       : '',
                    iFrameEl    : undefined,
                    expiration  : undefined,
                    xCaptchaV2Token: undefined
                  }

async function getToken(){
  if(this.token) return this.token

  return this.loadIframe()
}

function loadIframe(){
  if(this.iFrameEl) return this.useIframe(this.iFrameEl)

  if(!this.accountsUrl) throw new Error('@scbd-chm/form.composables.stores.auth.loadIframe: no accountsUrl given to auth store state')

  this.iFrameEl = this.getIframe()

  return this.useIframe(this.iFrameEl)
}

function state(){ return initState }

function isAccountsUrl(url){ return this.accountsUrl === url }

function receivePostMessage(event){

  if(!this.isAccountsOrigin(event)) return null

  const { type, authenticationToken, authenticationEmail, expiration } = JSON.parse(event.data)

  if(type!=='authenticationToken') throw new Error('AuthStore.receivePostMessage: unsupported authentication message type')

  this.$patch({
                token      : authenticationToken,
                email      : authenticationEmail,
                expiration : expiration
              })

  return
}

function isAccountsOrigin({ origin } = {}){ return this.isAccountsUrl(origin) }

function createIframe(){
  const div  = document.createElement('div')
  const inst = createApp(AuthIframe, { url: this.accountsUrl }).mount(div)

  document.getElementsByTagName('body')[0].appendChild(inst.$el)
  
  return inst.$el
}

function getIframe(){
  if (isServer()) return undefined

  const iFrames = window.document.getElementsByTagName('iframe')

  for (const anIframe of iFrames){
    const { origin } = new URL(anIframe.getAttribute('src'))

    if(this.accountsUrl === origin)
      return anIframe
  }

  return this.createIframe()
}

function useIframe($el){
  if (isServer() || !$el) return

  window.addEventListener('message', this.receivePostMessage)

  $el.onload = () => {
    const { contentWindow } = $el
    const   type            = 'getAuthenticationToken'
    const   msg             = JSON.stringify({ type })

    contentWindow.postMessage(msg, this.accountsUrl)

    return new Promise(this.loadingInterval)
  }

  return new Promise(this.loadingInterval)
}

function loadingInterval(resolve) {
  const timeout = setTimeout(() => {
                                        clearInterval(timer);
                                        resolve(this.token);
                                      }, 100)

  const timer = setInterval(() => {
                                      if(!this.token) return

                                      clearInterval(timer)
                                      clearTimeout(timeout)
                                      return resolve(this.token)
                                    }, 10)
}
