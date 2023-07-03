<template>
  <div>
    <div v-if="isVisible" class="alert alert-warning fade show" role="alert" >
      <button @click="hide()" type="button" class="close float-right" aria-label="Close">
        <Icon name="cancel"/>
      </button>

      <h5 v-if="numberOfOtherErrors">{{t('The following errors occurred:')}}</h5>
      <ul v-if="numberOfOtherErrors">
        <li v-for="(message, fieldId) in errorStore.errors" :key="fieldId">
          <span v-if="message.status"><strong>{{t('Status')}}</strong>: &nbsp;&nbsp;&nbsp;&nbsp;{{message.status}} &nbsp;<br/></span>
          <span v-if="message.name"><strong>{{t('Name')}}</strong>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{t(message.name)}} &nbsp;<br/></span>
          <span v-if="message.message"><strong>{{t('Message')}}</strong>: {{t(message.message)}} &nbsp;<br/></span>
          <span v-if="message.identifier"><strong>{{t('Identifier')}}</strong>: {{message.identifier}} &nbsp;<br/></span>
        </li>
      </ul>

      <h5 v-if="numberOfErrors">{{t('All errors must be resolved before submitting:')}}</h5>
      <ul v-if="numberOfErrors">
        <li v-for="(message, fieldId) in errors" :key="fieldId">  <a  :href="`#${fieldId}`"  > {{message}} </a> </li>
      </ul>

    </div>
    <slot/>
    <div v-if="isVisible" class="alert alert-warning fade show" role="alert" >
      <button @click="hide()" type="button" class="close float-right" aria-label="Close">
        <Icon name="cancel"/>
      </button>

      <h5 v-if="numberOfOtherErrors">{{t('The following errors occured:')}}</h5>
      <ul v-if="numberOfOtherErrors">
        <li v-for="(message, fieldId) in errorStore.errors" :key="fieldId">
          <span v-if="message.status"><strong>{{t('Status')}}</strong>: &nbsp;&nbsp;&nbsp;&nbsp;{{message.status}} &nbsp;<br/></span>
          <span v-if="message.name"><strong>{{t('Name')}}</strong>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{t(message.name)}} &nbsp;<br/></span>
          <span v-if="message.message"><strong>{{t('Message')}}</strong>: {{t(message.message)}} &nbsp;<br/></span>
          <span v-if="message.identifier"><strong>{{t('Identifier')}}</strong>: {{message.identifier}} &nbsp;<br/></span>
        </li>
      </ul>

      <h5 v-if="numberOfErrors">{{t('All errors must be resolved before submitting:')}}</h5>
      <ul v-if="numberOfErrors">
        <li v-for="(message, fieldId) in errors" :key="fieldId">  <a  :href="`#${fieldId}`"  > {{message}} </a> </li>
      </ul>

      <div v-if="optionsStore.debug" class="debug">
        <pre >{{ values }}</pre>
        clean:<br/>
        <pre >{{ clean(values) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>

import { useI18n        } from 'vue-i18n'
import Icon            from '../Icon.vue'
import { cleanNilsClone } from '../../composables/api'
import { useOptionsStore } from '../../composables/stores/options'
import { useErrorStore } from '../../composables/stores/error'

export default {
  name      : 'FormErrorSummary',
  components: { Icon },
  props     : { 
                errors       : { type: Object, required: true },
                meta         : { type: Object, required: true },
                values       : { type: Object                 }
              },
  computed : { numberOfErrors , isVisible, numberOfOtherErrors},
  methods  : { hide, subscribe },

  watch:{
    errors: { handler, deep: true} 
  },
  setup, data, created

}

function hide(){
  this.errorStore.$patch({ errors: [] })

  return this.show = false
}

function numberOfErrors(){
  return Object.keys(this.errors).length
}

function numberOfOtherErrors(){
  return this.errorStore.errors.length
}
function data(){
  return { show: true }
}

function isVisible(){
  return ((this.meta?.touched && this.numberOfErrors) || this.errorStore.errors.length) && this.show
}

function setup({ hiddenFields }){
  const { t, locale } = useI18n({ useScope: 'global' })

  const optionsStore = useOptionsStore()
  const errorStore    = useErrorStore()

  return { t, hiddenFields, locale, clean:cleanNilsClone, optionsStore, errorStore }
}

function created(){
  this.errorStore.$subscribe(this.subscribe)
}

function subscribe(){
  this.show= true
}

function handler(newErrors, oldErrors){
  const old = Object.keys(oldErrors || {}).length
  const newE = Object.keys(newErrors || {}).length

  if(newE !== old) this.show= true
}
</script>
<style scoped>
.fade {
    opacity: .9;
    transition: opacity .15s linear;
}
</style>