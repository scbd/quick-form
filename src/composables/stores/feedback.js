import { defineStore } from 'pinia'

const actions = { addFeedback }

export const useFeedbackStore = defineStore('feedback', { state, actions })

const initState = { msgs:[] }

function state(){ return initState }

function addFeedback({ status, name, message, code, identifier }){

  //const msgs = [ { status, name, message, code, identifier }, ...this.$state.msgs]

  //this.$patch({ msgs })
this.msgs.push({ status, name, message, code, identifier })
  return this.msgs
}