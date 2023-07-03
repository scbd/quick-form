import { defineStore } from 'pinia'

const actions = { addError }

export const useErrorStore = defineStore('error', { state, actions })

const initState = {  errors:[] }

function state(){ return initState }

function addError({ status, name, message, code, identifier }){

  const errors = [ { status, name, message, code, identifier }, ...this.$state.errors ]

  this.$patch({ errors })

  return errors
}