<template>
  <div>
    <div  v-if="msgs?.length && show" class="alert alert-success fade show" role="alert" >
      <button @click="hide()" type="button" class="close float-right" aria-label="Close">
        <Icon name="cancel"/>
      </button>

      <div v-if="msgs?.length">
        <div v-for="(message, fieldId) in msgs" :key="fieldId">
          <span v-if="message.name"><strong>{{t(message.name)}} </strong>&nbsp;<br/></span>
          <span v-if="message.message">{{t(message.message)}} &nbsp;<br/></span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useI18n        } from 'vue-i18n'
import Icon            from '../Icon.vue'
import { useFeedbackStore } from '../../composables/stores/feedback'
import { storeToRefs } from 'pinia'


export default {
  name      : 'SuccessFeedback',
  components: { Icon },

  computed : { numberOfMsgs , isVisible},
  methods  : { hide, subscribe },
  setup

}

function hide(){
  this.feedbackStore.$patch({ msgs: [] })

  return this.show = false
}

function numberOfMsgs(){
  return this.msgs.length
}


function isVisible(){
  return this.numberOfMsgs && this.show
}



function setup(){
  const { t, locale } = useI18n({ useScope: 'global' })
 const show = ref(false)
  const feedbackStore    = useFeedbackStore();
  const msgs = ref(feedbackStore.msgs)
  feedbackStore.$subscribe((m,s)=>{
    console.log('mutation', m);
  console.log('state', s.msgs.length);
  console.log('!s.msgs.length', !s.msgs.length);
  if(!s.msgs.length) return
  msgs.value = s.msgs
  show.value = true

  setTimeout(()=>{
    msgs.value = s.msgs
  }, 0)
  })
  

  return { t, locale, feedbackStore, msgs, show }
}



function subscribe(m,s){
  console.log('mutation', m);
  console.log('state', s);
  this.show= true
}


</script>
<style scoped>
.fade {
    opacity: .9;
    transition: opacity .15s linear;
}
</style>