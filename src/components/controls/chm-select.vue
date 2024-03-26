<template>
  <div class="form-group SelectInput" :class="{ 'has-error': !!(errorMessage && meta.touched && !isOpen), success: meta.valid }" >

    <label :for="name">{{ t(name) }}</label>

    <multiselect
        :id="name"
        v-model="inputValue"
        :placeholder="t(`${name}.placeholder`)"
        track-by="identifier"
        label="name"
        :options="optionsList"
        :multiple="options.multiple"
        :taggable="true"
        :group-select="true"
        @input="handleChange"
        @blur="handleBlur"
        @open="toggleOpen"
        @close="toggleOpen"
        :searchable="true"
        :hide-selected="true"
        ref="multiSelect"
        :class="{ 'has-error': !!(errorMessage && meta.touched && !isOpen), success: meta.valid }"
      />
    <div class="help" v-show="(errorMessage && meta.touched && !isOpen) || meta.valid">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>

import { toRef, ref , computed, watch } from 'vue'

import { object , array  } from 'yup'
import { getData, lookUp } from '@scbd-chm/cached-apis'

import { useField   } from 'vee-validate'
import { getMsgFunc } from '../../composables/schema-validation'
import { useI18n    } from 'vue-i18n'
import { useMeStore } from '../../composables/stores/me'

import isFunction    from 'lodash.isfunction'
import isPlainObject from 'lodash.isplainobject'
import Multiselect   from 'vue-multiselect'
import   intersect     from 'lodash.intersection';

export default {
  name       : 'ChmSelectInputControl',
  components : { Multiselect },
  props      : {
                  name          : { type: String, required: true },
                  formCtx       : { type: Object, required: true },
                  value         : { type: [ Object, Array ] },
                  label         : { type: String, default: '' },
                  placeholder   : { type: String, default: '' },
                  options       : { type: Object, default: defaultOptions, validator }
                },
  methods: { toggleOpen },
  setup, data, mounted
}


function setup(props) {
  const { t }         = useI18n({ useScope: 'global' })
  const   optionsList = ref([])

  const   me          = useMeStore()

  getOptionList(props.options.type, props.options.additionalOptions)
      .then((data) =>  optionsList.value = data ) 

  me.$subscribe(updateOptionList(props, optionsList))


  const name = toRef(props, 'name');

  const   label         = toRef(props, 'label')
  const   computedLabel = computed(() => label.value || t(name.value))


  const getMsg = getMsgFunc(t, computedLabel)
  const rule   = props.options.multiple? array().nullable() : object().nullable()
  const rules  = props.options?.rules?.required? rule.required(getMsg('required')) : undefined

  const { value: inputValue, errorMessage, handleBlur, handleChange, meta, } = useField(name, rules);

  lookUpValues(inputValue).then((lookUpReturn) =>  inputValue.value=lookUpReturn )

  const breaker = watch(inputValue, (first) => {


                                                lookUpValues(first).then((lookUpReturn)=> { 

                                                  if(lookUpReturn) { breaker()

                                                  inputValue.value=lookUpReturn
                                                  }else{
                                                    const {additionalOptions = [] } = props.options
                                                    const custom = additionalOptions.find(({ identifier } ={})=> identifier===first?.identifier)

                                                    if(custom) {
                                                      breaker()

                                                      inputValue.value=custom
                                                    }
                                                  }
                                                })
                                              });

  return { t, handleChange, handleBlur, errorMessage, inputValue, meta, optionsList }
}

function data (){ return { isOpen: false } }

async function getOptionList(type, additionalOptions = []){
  if(!isTypeValid(type)) throw new Error('Error invalid chm-options type: ', type)

  if(type !== 'allOrgTypes') return getData(type)

  const promisesForData = [ getData('govTypes'), getData('orgTypes') ]
  const data            = await Promise.all(promisesForData)

  return [ ...additionalOptions.filter(({ adminOnly }) => !adminOnly), ...data[0], ...data[1] ]
}


function updateOptionList({ options, formCtx }, optionsList){ return async (m,s) => {

    const { type, additionalOptions = [] } = options
    const admins  = [ 'Administrator', 'idb-admin' ];
    const isAdmin = !!intersect(s?.roles || [], admins).length

    if(!isTypeValid(type)) throw new Error('Error invalid chm-options type: ', type)

    if(type !== 'allOrgTypes') return getData(type)

    const promisesForData = [ getData('govTypes'), getData('orgTypes') ]
    const data            = await Promise.all(promisesForData)
    const moreOptions     = isAdmin? additionalOptions : additionalOptions.filter(({ adminOnly }) => !adminOnly)

    optionsList.value = [ ...moreOptions, ...data[0], ...data[1] ]

    return optionsList
  }
}

function toggleOpen(){
  if(this.isOpen) setTimeout(() => this.isOpen = !this.isOpen, 250 )
  else this.isOpen = !this.isOpen
}

function mounted(){
  //chrome anoying with muliselect
  this.$refs.multiSelect.$refs.search.setAttribute('autocomplete', 'none')
}
  
async function lookUpValues(valueRef){
  const value      = valueRef?.value? valueRef.value : valueRef

  if(!value) return undefined

  const ids        = Array.isArray(value)? value.map(({ identifier })=> identifier ) : value.identifier
  const isSingle   = !Array.isArray(value)

  const foundValue = await lookUp('all', ids, isSingle)

  return foundValue
}

function defaultOptions (rawProps) {
  return ({ 
    type          : 'countries',
    multiple      : false
  }) 
}

const types = [ 'all', 'aichis', 'subjects', 'countries', 'allOrgTypes', 'orgTypes', 'govTypes', 'regions', 'geoLocations', 'sdgs', 'actionCategories', 'documentStates', 'schemas']


function validator (value) {
  const { type, multiple, rules } = value || {}

  return isTypeValid(type) && isRulesValid(rules)
}

function isTypeValid(type){
  if(!type || !(typeof type === 'string' || type instanceof String)) return false

  return types.includes(type)
}

function isRulesValid(value){

  return typeof value === 'undefined' || isFunction(value) || isPlainObject(value)
}
</script>


<style scoped>
/* @import url("https://cdn.cbd.int/vue-multiselect@next/dist/dist/vue-multiselect.css"); */

.help {
  padding-left: 5px;
  margin    : 0;
  font-size : 14px;
  color     : red;
}
.multiselect.has-error >>> div{ background-color: var(--vv--error-bg-color); }
.multiselect{ padding-top: .25em;}
</style>