<template>
  <div v-if="opts.id"  ref="quickFormEl" :id="opts.id" >
    <div class="card">
      <div class="card-body">
        <div class="mb-3"  >
          <Icons v-once/>
          <SuccessFeedback/>

          <Form v-if="!feedbackStore.msgs.length" v-slot="{ values, errors, meta }" @submit="onSubmit"  :initial-values="document" >
            <ValidationSummary v-bind="{ values, errors, meta }">

            <div v-for="(row, index) in opts.rows" :key="index"  class="row">
              <div  class="col" v-for="({ name, is, value, options }, colIndex) in row.columns" :key="colIndex" >
                <component v-if="!isPlainObject(is)" :is="is" :name="name"  :options="options" :value="value" :label="t(name)" :placeholder="t(`${name}.placeholder`)" :form-ctx="{ errors, meta, values, schema:opts, user, identifier }"/>
              </div>
            </div>

            </ValidationSummary>

            <Captcha class="pb-3"/>
            
            <button class="submit-btn" type="submit">Submit</button>
            
          </Form>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>

import { toRef, ref, defineAsyncComponent } from 'vue-demi'

import { useI18n            } from 'vue-i18n'
import { Form               } from 'vee-validate'
import { initializeApiStore } from '@scbd-chm/cached-apis'
import   Icons                from './Icons.vue'
import   isPlainObject        from 'lodash.isplainobject'

import { useAuthStore     } from '@/composables/stores/auth'
import { useMeStore       } from '../composables/stores/me'
import { useOptionsStore  } from '../composables/stores/options'
import { useFeedbackStore } from '../composables/stores/feedback'

import { postDocument, getIdentifierFromQuery, getDocument, putDocument } from '../composables/api'

import Captcha from './controls/captcha.vue'

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
  components: { UseAccount, Captcha, Form, Icons, TextInput, LStringArea, ChmSelect, Attachments, LString, ValidationSummary, SuccessFeedback, CheckBox },
  methods   : { isPlainObject, onSubmit },
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

  optionsStore.$subscribe(checkAuth(user))

  optionsStore.loadSchema(props.schemaName, optionsPropRef).then(async (s) => {

    options.value = s

    const sharedMessages = await s.getMessages(locale.value)

    $i18n.mergeLocaleMessage(locale.value, sharedMessages || {})

    identifier.value = getIdentifierFromQuery()
    document.value   = await loadExistingDocument(s, identifier.value)
  })

  return { t, i, chmFormEl, user, document, identifier,  feedbackStore, opts: options }
}

function created(){  initializeApiStore() }

async function onSubmit(values) { 
  const isEdit   = this.identifier
  const response = isEdit? await putDocument(values): await postDocument(values)
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
