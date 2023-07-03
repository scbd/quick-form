<template>
  <div v-if="isAdmin" class="form-group TextInput" :class="{ 'has-error': !!(errorMessage && meta.touched), success: (meta.valid && meta.touched) }" >

    <label v-if="!isHidden" :for="name">{{ computedLabel }}</label>
    <input
      :name="name"
      :id="name"
      :type="options.type"
      :value="inputValue"
      :placeholder="placeholder || t(`${name}.placeholder`)"
      @input="input"
      @blur="handleBlur"
      @change="change"
    />

    <p class="help-message" v-show="(errorMessage && meta.touched) || meta.valid">
      {{ errorMessage  }}
    </p>
  </div>
</template>

<script>
import { toRef, computed, watch } from 'vue-demi'

import { useField       } from 'vee-validate'
import { useI18n        } from 'vue-i18n'
import { readFieldRules } from '../../composables/schema-validation'
import   isFunction       from 'lodash.isfunction'
import   isPlainObject    from 'lodash.isplainobject'

export default {
  name    : 'TextInputControl',
  props   : {
              name          : { type: String, required: true },
              formCtx       : { type: Object, required: true },
              value         : { type: [ String, Number, Date ], default: '' },
              label         : { type: String, default: '' },
              placeholder   : { type: String, default: '' },
              options       : { type: Object, default: defaultOptions, validator }
            },
  methods : { change, input },
  computed: { isHidden, isAdmin },
  setup, created
};

function setup(props) {
    const { t }           = useI18n( { useScope: 'global' })
    const   name          = toRef(props, 'name')
    const   label         = toRef(props, 'label')
    const   options       = toRef(props, 'options')
    const   computedLabel = computed(() => label.value || t(name.value))
    const   rules         = readFieldRules({ props, t, computedLabel })

    const { value: inputValue, errorMessage, handleBlur, handleChange, meta } = useField(name, rules, { initialValue: props.value });

    const breaker = watch(inputValue, (first) => {
                                                    if(!options.value.type.includes('date')) return breaker()

                                                    if(!isValidDateString(first)) return breaker()

                                                    inputValue.value = first.includes('T')? first.substring(0, first.indexOf('T')) : first

                                                    breaker()
                                              });

    return { t, handleChange, handleBlur, errorMessage, inputValue, meta, computedLabel, options }
}

// const 
function created(){
  this.$watch('value', (value) => this.inputValue = value )
}

function change(){
  this.handleChange(...arguments)
  this.$emit('change', { name: this.name, value: this.inputValue })
}

function input(){
  this.handleChange(...arguments)
  this.$emit('input', this.inputValue)
}

function defaultOptions () {
  return ({ 
            type : 'text',
            rules: undefined,
          }) 
}

function validator (value) {
  const { type, rules } = { ...(value || {}), ...{ type: 'text', rules: undefined } }

  return isTypeValid(type) && isRulesValid(rules)
}

const types = [ 'text', 'url', 'email', 'password', 'hidden', 'date']

function isTypeValid(type){
  if(!type || !(typeof type === 'string' || type instanceof String)) return false

  return types.includes(type)
}

function isRulesValid(value){

  return typeof value === 'undefined' || isFunction(value) || isPlainObject(value)
}

function isHidden(){
  return this.options?.type === 'hidden'
}

function isValidDateString(testString){
  return !(new Date(testString)).toString().includes('Invalid Date')
}

function isAdmin(){
  if(!this.options.adminOnly) return true

  if(!this.formCtx?.user) return false

  return this.me.isAdmin(this.formCtx.schema)
}
</script>

<style  scoped>
.TextInput {
  position: relative;
  margin-bottom: calc(1em * 1.5);
  width: 100%;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
}

input {
  border-radius: 5px;
  border: 2px solid transparent;
  padding: 15px 10px;
  outline: none;
  background-color: #f2f5f7;
  width: 100%;
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out,
  background-color 0.3s ease-in-out;
}

input:focus {
  border-color: var(--vv-primary-color);
}

.TextInput.has-error input {
  background-color: var(--vv--error-bg-color);
  color: var(--vv--error-color);
}

.TextInput.has-error input:focus {
  border-color: var(--vv--error-color);
}

.TextInput.has-error .help-message {
  color: var(--vv--error-color);
}

.TextInput.success input {
  background-color: var(--vv--success-bg-color);
  color: var(--vv--success-color);
}
</style>