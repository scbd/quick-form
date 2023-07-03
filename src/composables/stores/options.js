import { defineStore } from 'pinia'
import   useSchema     from '@/composables/schemas/index.js'

const actions = { loadSchema }

export const useOptionsStore = defineStore('options', { state, actions })

const initState = { 
  mode        : 'production',
  id          : '',
  apiUrl      : '',
  accountsUrl : '',
  admins      : undefined,
  rows        : undefined,
  sanitizers  : undefined,
  getMessages : undefined,
  sitekey     : '',
  debug       : false
}

function state(){ return initState }

async function loadSchema(identifier, options = {}){
  if(!identifier) throw new Error('No schema identifier passed to load form from')
  
  // const remoteSchema = (await useSchema( identifier ))
  const schema       = { ...(await useSchema( identifier )), ...options.value }

  this.$patch({ ...schema })

  return this
}

function reactiveState(){
  const { mode, id, apiUrl, accountsUrl, admins, rows, debug, sitekey } = storeToRefs(this)

  return { mode, id, apiUrl, accountsUrl, admins, rows, debug, sitekey }
}

