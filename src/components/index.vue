<template>
  <div v-if="opts.id"  ref="quickFormEl" :id="opts.id" >
    <Icons v-once/>
    <div class="card">
      <div class="card-body">
        <Loading v-if="isLoading"/> 
        <SuccessFeedback v-show="!isLoading"/>
        <div  v-show="!isLoading" class="mb-3"  >
          
          
          <form v-if="!msgs.length"  @submit.prevent="onSubmit" >
            <ValidationSummary v-bind="form">

            <div v-for="(row, index) in opts.rows" :key="index"  class="row">
              <div  class="col" v-for="({ name, is, value, options }, colIndex) in row.columns" :key="colIndex" >
                <component v-if="!isPlainObject(is)" :is="is" :name="name"  :options="options" :value="value" :label="t(name)" :placeholder="t(`${name}.placeholder`)" :form-ctx="{ errors:form.errors, meta:form.meta, values:form.values, form, schema:opts, user, identifier, isAdmin }"/>
              </div>
            </div>

            </ValidationSummary>

            <Captcha :is-admin="isAdmin" class="pb-3"/>
            
            <button class="submit-btn" type="submit">Submit</button>

          </form>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>

import { toRef, ref, defineAsyncComponent, reactive, computed } from 'vue'
import   intersect     from 'lodash.intersection';
import { useI18n            } from 'vue-i18n'
import { Form  , useForm             } from 'vee-validate'
import { initializeApiStore } from '@scbd-chm/cached-apis'
import   Icons                from './Icons.vue'
import   isPlainObject        from 'lodash.isplainobject'

import { useAuthStore     } from '@/composables/stores/auth'
import { useMeStore       } from '../composables/stores/me'
import { useOptionsStore  } from '../composables/stores/options'
import { useFeedbackStore } from '../composables/stores/feedback'

import { postDocument, getIdentifierFromQuery, getDocument, putDocument } from '../composables/api'

import Captcha from './controls/captcha.vue';
import Loading from '@/components/Loading.vue';

import consola from 'consola'

const UseAccount        = defineAsyncComponent(() => import('./controls/use-account/index.vue'))
const Attachments       = defineAsyncComponent(() => import('./controls/attachments/main.vue'))
const ChmSelect         = defineAsyncComponent(() => import('./controls/chm-select.vue'))
const LString           = defineAsyncComponent(() => import('./controls/l-string.vue'))
const ValidationSummary = defineAsyncComponent(() => import('./controls/validation-summary.vue'))
const LStringArea       = defineAsyncComponent(() => import('./controls/l-string-area.vue'))
const TextInput         = defineAsyncComponent(() => import('./controls/text-input.vue'))
const CheckBox          = defineAsyncComponent(() => import('./controls/check-box.vue'))
const SuccessFeedback   = defineAsyncComponent(() => import('./controls/success-feedback.vue'))

export default {
  name      : 'QuickForm',
  props     : {
                schemaName : { type: String, required: true },
                options    : { type: Object }
              },
  components: { Loading, UseAccount, Captcha, Form, Icons, TextInput, LStringArea, ChmSelect, Attachments, LString, ValidationSummary, SuccessFeedback, CheckBox },
  methods   : { isPlainObject, onSubmit, onSuccess, onFailure },
  created,  setup
}

const checkAuth =  (user) => async (mutation) => {
  const auth = useAuthStore()

  if (!mutation.payload?.accountsUrl) return

  auth.$patch({ accountsUrl: mutation.payload.accountsUrl })
        
  const me = useMeStore()

  user.value = await me.getUser()
}

function setup(props){
  const isLoading = ref(true);
  let form = reactive(useForm());
  const   $i18n          = useI18n({ useScope: 'global' })
  const   chmFormEl      = ref(null)
  const   user           = ref(null)
  const   document       = ref(undefined)
  const   identifier     = ref(undefined)
  const   options        = ref({})
  const { t, locale }    = $i18n
  const   i          = ref(0)
  const feedbackStore  = useFeedbackStore()
  const optionsStore   = useOptionsStore ()
  const optionsPropRef = toRef           (props, 'options')
  const meStore = useMeStore();
  const isAdmin = ref(false);
  const msgs = computed(()=> feedbackStore.msgs)
  optionsStore.$subscribe(checkAuth(user))
  loadSchema()

  const admins  = [ 'Administrator', 'idb-admin' ];

  isAdmin.value = meStore.isAdmin({admins})
  meStore.$subscribe(async(m, s)=>{
    isLoading.value = true;

    if(m.payload.userID && m.payload.userID === 1) return isLoading.value = false;
    if(m.payload?.profile?.UserID && m.payload.profile.UserID === 1) return isLoading.value = false;

    await loadSchema()

    isAdmin.value = !!intersect(s.roles, admins).length

    setTimeout(()=> isLoading.value = false, 500);
  })

  function loadSchema(){
    isLoading.value = true;
    return optionsStore.loadSchema(props.schemaName, optionsPropRef).then(async (s) => {

      options.value = s

      const sharedMessages = await s.getMessages(locale.value)

      $i18n.mergeLocaleMessage(locale.value, sharedMessages || {})

      identifier.value = getIdentifierFromQuery()
      if(!identifier.value) return setTimeout(()=> isLoading.value = false, 500)

      document.value   = await loadExistingDocument(s, identifier.value)
      form.setValues(document.value)

      setTimeout(()=> isLoading.value = false, 500);
    })
  }
  setTimeout(loadSchema, 500);


  return { msgs, t, i, chmFormEl, user, document, identifier,  feedbackStore, opts: options, form, isAdmin,isLoading }
}

function created(){  initializeApiStore() }

function onSubmit(values) { 
  this.isLoading = true

  consola.info('Submitting form', values)



  const t = this.form.handleSubmit(this.onSuccess, this.onFailure)()


}
async function onSuccess (values) {
    const feedbackStore         = useFeedbackStore(this.$pinia);
    const isEdit                = this.identifier
    const { data, status, msg } = isEdit? await putDocument(values): await postDocument(values);

    if(status === 200) feedbackStore.addFeedback(msg)

    setTimeout(()=> this.isLoading = false, 500);
  }

  async function onFailure({ values, errors, results }) {

    setTimeout(()=> this.isLoading = false, 500);
  }

async function loadExistingDocument(schema, identifier){
  const isReadyToLoad = identifier && schema

  if(!isReadyToLoad) return undefined
  
  return getDocument()
}
</script>

<style>

:root {
  --vv-primary-color: #0071fe;
  --vv--error-color: #f23648;
  --vv--error-bg-color: #fddfe2;
  --vv--success-color: #21a67a;
  --vv--success-bg-color: #e0eee4;
}

.submit-btn {
  background: var(--vv-primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  width: 100%;
  border-radius: 7px;
  margin-top: 40px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}
</style>
