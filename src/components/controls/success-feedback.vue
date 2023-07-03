<template>
  <div>
    <div  v-if="isVisible" class="alert alert-success fade show" role="alert" >
      <button @click="hide()" type="button" class="close float-right" aria-label="Close">
        <Icon name="cancel"/>
      </button>

      <div v-if="numberOfMsgs">
        <div v-for="(message, fieldId) in feedbackStore.msgs" :key="fieldId">
          <span v-if="message.name"><strong>{{t(message.name)}} </strong>&nbsp;<br/></span>
          <span v-if="message.message">{{t(message.message)}} &nbsp;<br/></span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import { useI18n        } from 'vue-i18n'
import Icon            from '../Icon.vue'
import { useFeedbackStore } from '../../composables/stores/feedback'

export default {
  name      : 'SuccessFeedback',
  components: { Icon },

  computed : { numberOfMsgs , isVisible},
  methods  : { hide, subscribe },
  setup, data, created

}

function hide(){
  this.feedbackStore.$patch({ msgs: [] })

  return this.show = false
}

function numberOfMsgs(){
  return this.feedbackStore.msgs.length
}

function data(){
  return { show: true }
}

function isVisible(){
  return this.numberOfMsgs && this.show
}

function setup(){
  const { t, locale } = useI18n({ useScope: 'global' })

  const feedbackStore    = useFeedbackStore()

  return { t, locale, feedbackStore }
}

function created(){
  this.feedbackStore.$subscribe(this.subscribe)
}

function subscribe(){
  this.show= true
}


</script>
<style scoped>
.fade {
    opacity: .9;
    transition: opacity .15s linear;
}
</style>