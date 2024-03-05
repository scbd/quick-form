<template>
  <div  class="form-check check-input  mb-5" :class="{ 'has-error': !!(errorMessage && meta.touched), success: meta.valid }" >
      <label :for="name" style="margin-left: -1.25rem;">{{ computedLabel }}</label>
      <input
          :name="name"
          :id="name"
          type="checkbox"
          @change="change(value)"
          class="form-check-input" 
          :value="inputValue"
          style="margin-top:5px;"
          checked
      />
      <label class="form-check-label text-muted" :for="name" style="margin-top:5px;">
          {{placeholder || t(`${name}.placeholder`)}}
      </label>
      <p class="help-message" v-show="(errorMessage && meta.touched) || meta.valid">
          {{ errorMessage  }}
      </p>
  </div>

</template>
<script setup>
import { toRefs,  computed, onMounted, defineProps }  from 'vue';
import { useField, useForm         }  from 'vee-validate';
import { useMeStore        }  from '@/composables/stores/me';
import   t  , { getLocale  }  from '@/composables/i18n.js';
import   Icon                 from '@/components/Icon.vue';
import   lodashSet            from 'lodash.set';
import consola from 'consola';


const   props  = defineProps({ 
                                  name          : { type: String, required: true },
                                  formCtx       : { type: Object, required: true },
                                  value         : { type: [ Boolean ], default: false },
                                  label         : { type: String, default: '' },
                                  placeholder   : { type: String, default: '' },
                                  options       : { type: Object, default: ()=>({  rules: undefined }) }
                              });
const { name, formCtx, value, label, placeholder, options  } = toRefs(props);


const {setValues , values}= useForm()

const   computedLabel = computed(() => label.value || t(name.value))
  const   me            = useMeStore()

  const { uncheckedValue, checkedValue } = options.value;

  const fieldOptions = { type: "checkbox", checkedValue, uncheckedValue, initialValue:value, valueProp: value }

  const { value: inputValue, meta, errorMessage} = useField(name, undefined, fieldOptions );

  const locale = getLocale();

  onMounted(() => {
      change()
  })
function change(){
  if(!inputValue.value) inputValue.value = checkedValue
  else inputValue.value = uncheckedValue

  toggle()
}

async function toggle() {
  const { name, email, getProfile } = useMeStore()



  const { Organization: organization,  Country: country, City: city } = await getProfile()
  const { values: formModel } = formCtx.value
  const { map               } = options.value
  const   userValues          = { name, email, organization, country, city }


//TODO - localize the path
  const newValues = {}
  for (const key of Object.keys(map)) {
      const isLstring = [ 'name', 'organization' ].includes(key)
      const path      = isLstring? `${map[key]}.en` : map[key]
      const value     = inputValue.value? userValues[key] : undefined

      if(key.includes('country') ){
          const countryObj = inputValue.value? { identifier: value} : undefined;
         // newValues[path] = countryObj
          lodashSet(newValues, path, countryObj);
          continue;
      }

      // newValues[path] = value
      lodashSet(newValues, path, value);
  }
  formCtx.value.form.setValues(newValues)

 // this.formCtx.values.creator.email='sadsasddsadsadasdas'
  // consola.info('formModel',formCtx.value.values);
  // consola.info('newValue',newValues);
  // consola.info('formModel',this.formCtx);

}

</script>

<!-- <script>
import { toRefs    , computed }     from 'vue'               ;
import { useField  , useForm }      from 'vee-validate'           ;
import { useMeStore }               from '@/composables/stores/me';
import   t          , { getLocale } from '@/composables/i18n.js'  ;
import   Icon                       from '@/components/Icon.vue'  ;
import   lodashSet                  from 'lodash.set'             ;
import   consola                    from 'consola'                ;



export default {
  name      : 'UseAccountControlBox',
  components: { Icon },
  props     : {
                name          : { type: String, required: true },
                formCtx       : { type: Object, required: true },
                value         : { type: [ Boolean ], default: false },
                label         : { type: String, default: '' },
                placeholder   : { type: String, default: '' },
                options       : { type: Object, default: defaultOptions, validator }
              },
  methods   : { change, toggle},
  setup, mounted    
};

function setup(props) {
  const { setValues } = useForm();
  const { name, label , placeholder, options, value, formCtx, } = toRefs(props);

  const   computedLabel = computed(() => label.value || t(name.value))
  const   me            = useMeStore()

  const { uncheckedValue, checkedValue } = options.value;

  const fieldOptions = { type: "checkbox", checkedValue, uncheckedValue, initialValue:value, valueProp: value }

  const { value: inputValue, meta, errorMessage} = useField(name, undefined, fieldOptions );

  const locale = getLocale();

  return { setValues, t, locale,  toggle, placeholder, formCtx,  inputValue, checkedValue, uncheckedValue, computedLabel, me, meta, errorMessage}
}

async function toggle() {
  const { name, email, getProfile } = useMeStore()



  const { Organization: organization,  Country: country, City: city } = await getProfile()
  const { values: formModel } = this.formCtx
  const { map               } = this.options
  const   userValues          = { name, email, organization, country, city }



  const newValues = {}
  for (const key of Object.keys(map)) {
      const isLstring = [ 'name', 'organization' ].includes(key)
      const path      = isLstring? `${map[key]}.${this.locale}` : map[key]
      const value     = this.inputValue? userValues[key] : undefined
 
      if(key.includes('country') ){
          const countryObj = this.inputValue? { identifier: value} : undefined;
          newValues[path] = countryObj
          //lodashSet(this.formCtx.values, path, countryObj);
          continue;
      }

      newValues[path] = value
     // lodashSet(this.formCtx.value, path, value);
  }
  this.setValues(newValues)

 // this.formCtx.values.creator.email='sadsasddsadsadasdas'
  consola.info('formModel',this.formCtx.values);
  // consola.info('formModel',this.formCtx);

}

function mounted(){
  this.change()
}

function change(){
  if(!this.inputValue) this.inputValue = this.checkedValue
  else this.inputValue = this.uncheckedValue

  this.toggle()
}

function defaultOptions () {
  return ({  rules: undefined, }) 
}

function validator (value) {
  const { type, rules } = { ...(value || {}), ...{ type: 'checkbox', rules: undefined } }

  return true
}
</script>
 -->
<style  scoped>
.check-input {
  position: relative;
  margin-bottom: calc(1em * 2.2);
  width: 100%;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
  
}

input:focus {
  border-color: var(--vv-primary-color);
}

.check-input.has-error input {
  background-color: var(--vv--error-bg-color);
  color: var(--vv--error-color);
}

.check-input.has-error input:focus {
  border-color: var(--vv--error-color);
}

.check-input.has-error .help-message {
  color: var(--vv--error-color);
}

.check-input.success input {
  background-color: var(--vv--success-bg-color);
  color: var(--vv--success-color);
}
</style>