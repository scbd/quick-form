<template>
    <div v-if="isAdmin" class="form-group TextInput" :class="{ 'has-error': !!(errorMessage && meta.touched), success: (meta.valid && meta.touched) }" >

      <label :for="name">{{ computedLabel }}</label>
      <input
        :name        ="`${name}.${locale}`"
        :id          ="`${name}.${locale}`"
        :value       ="inputValue"
        :placeholder ="placeholder || t(`${name}.placeholder`)"
        @input       ="input"
        @blur        ="handleBlur"
        @change      ="change"
      />

      <p class="help-message" v-show="(errorMessage && meta.touched) || meta.valid">
        {{ errorMessage  }}
      </p>
    </div>
</template>

<script>
import { toRef         , computed } from 'vue'
import { useField       }           from 'vee-validate'
import { useI18n        }           from 'vue-i18n'
import { readFieldRules }           from '../../composables/schema-validation'
import   isFunction                 from 'lodash.isfunction'
import   isPlainObject              from 'lodash.isplainobject'
import { useMeStore     }           from '../../composables/stores/me'

export default {
  name      : 'LStringControl',
  props     : {
              name          : { type: String, required: true },
              formCtx       : { type: Object, required: true },
              value         : { type: String, default: '' },
              //value         : { type: Object, default: () => { en: '' } },
              label         : { type: String, default: '' },
              placeholder   : { type: String, default: '' },
              options       : { type: Object, default: defaultOptions, validator }

            },
  methods: { change, input },
  computed: { isAdmin },
  setup
}

function setup(props) {

  const { t, locale } = useI18n({ useScope: 'global' })
  const   nameRef     = toRef(props, 'name')
  const   name        = computed(() =>`${nameRef.value}.${locale.value}` )
  const   me            = useMeStore()
  const   label         = toRef(props, 'label')
  const   computedLabel = computed(() => label.value || t(name.value))

  const rules = readFieldRules({ props, t, computedLabel })

//initial value come from form. ... need to handle prop setting
  const { value: inputValue, errorMessage, handleBlur, handleChange, meta } = useField(name, rules);

  
  return { t, handleChange, handleBlur, errorMessage, inputValue, meta, locale, computedLabel, me };
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

function isRulesValid(value){

  return typeof value === 'undefined' || isFunction(value) || isPlainObject(value)
}

function validator (value) {
  const { rules } = value || {}

  return  isRulesValid(rules)
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