import { defineStore } from 'pinia'
import   intersect     from 'lodash.intersection'
import { useAuthStore } from './auth'
import axios from 'axios'

const globals = { hasRequestMeListener : false }

const actions = { isAdmin, isStaff, isGov, logOut, onRequestMeEvent, dispatchMe, getUser, getProfile}

export const useMeStore = defineStore('me', { state, actions })

const initState = {
                    userID         : 1,
                    name           : 'anonymous',
                    email          : 'anonymous@domain',
                    government     : undefined,
                    userGroups     : [],
                    isAuthenticated: false,
                    isEmailVerified: false,
                    institution    : '',
                    roles          : [],
                    profile        : undefined
                  }

function state(){ return initState }

function logOut(){
  return this.$reset()
}

function isGov(){ return this.government? this.government : '' }

function dispatchMe(element){
  const event = new Event('$me', { bubbles: true })

  event.$me = this

  element.dispatchEvent(event)

  this.onRequestMeEvent(element)
}

function onRequestMeEvent(element){
  if (globals.hasRequestMeListener) return

  globals.hasRequestMeListener = true

  window.document.addEventListener('$requestMe', () => this.dispatchUser(element))
}

function isAdmin({ admins } = { admins: [] }){

  if(!Array.isArray(admins) || !Array.isArray(this.roles) ) return false

  return !!intersect(this.roles, admins).length
}

function isStaff(){
  if(Array.isArray(this.userGroups)) return false

  return this.userGroups.includes('SCBD')
}

async function getUser(){

  if (this.isAuthenticated) return this.$state

  const authUser = await getAuthUser()

  await this.$patch({ ...authUser })

  const profile = await this.getProfile(this.userID)

  await this.$patch({ profile })

  return this.$state
}

async function getProfile(){
  const { headers, accountsUrl } = await getAuth()

  const { data } = await axios.get(`${accountsUrl}/api/v2013/users/${encodeURIComponent(this.userID)}`, { headers })
  
  return data
}

async function getAuthUser(){
  const { headers, accountsUrl } = await getAuth()

  const { data } = await axios.get(`${accountsUrl}/api/v2013/authentication/user`, { headers })

  return data
}

async function getAuth(){
  const auth    = useAuthStore()
  const token   = await auth.getToken()
  const headers = { Authorization: `Ticket ${token}` }

  return { headers, ...auth.$state }
}




async function $getUser(){
  await isTokenLoaded()

  const   me                             = await getUser()
  const { FirstName, LastName, Country } = await getProfile(me.userID)
  
  const firstName = FirstName
  const lastName  = LastName
  const country   = Country

  globalProps.Vue.nextTick(() => globalProps.me.set({ ...me, firstName, lastName, country }))

  return globalProps.me
}

function $logOut(){
  globalProps.me.logOut()
  globalProps.auth.logOut()

  if(!globalProps.el) return
  
  const msg = JSON.stringify({ type: 'setAuthenticationToken', authenticationToken: null, authenticationEmail: null, expiration: null })

  globalProps.el.contentWindow.postMessage(msg, globalProps.auth.accountsUrl)

  setTimeout(() => {
    globalProps.auth.dispatchUser(globalProps.el, this.me)
    this.$root.$emit('$me', this.me)
  }, 1500)
}