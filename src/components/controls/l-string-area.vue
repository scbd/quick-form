<template>
    <div class="form-group TextArea" :class="{ 'has-error': !!(errorMessage && meta.touched), success: (meta.valid && meta.touched) }" >
      <label :for="name">{{ t(name) }}</label>
      <textarea
        :name        ="`${name}.${locale}`"
        :id          ="`${name}.${locale}`"
        :value="inputValue"
        :placeholder="t(`${name}.placeholder`)"
        :rows="options.rows"
        @input="handleChange"
        @blur="handleBlur"
      />

      <p class="help-message" v-show="(errorMessage && meta.touched) || meta.valid">
        {{ errorMessage  }}
      </p>
    </div>
</template>

<script>
import { toRef   , computed } from 'vue'
import { useField           } from 'vee-validate'
import { useI18n            } from 'vue-i18n'
import isFunction    from 'lodash.isfunction'
import isPlainObject from 'lodash.isplainobject'
import { readFieldRules } from '../../composables/schema-validation'

export default {
  name      : 'LStringAreaControl',
  props     : {
                name          : { type: String, required: true },
                formCtx       : { type: Object, required: true },
                value         : { type: String, default: '' },
                label         : { type: String, default: '' },
                placeholder   : { type: String, default: '' },
                options       : { type: Object, default: defaultOptions, validator }
              },
  setup
}

function setup(props) {
  const { t, locale } = useI18n({ useScope: 'global' })
  const   nameRef     = toRef(props, 'name')
  const   name        = computed(() =>`${nameRef.value}.${locale.value}` )
  const   value       = computed(() => props.value? props.value[locale.value] : props.value)

  const   label         = toRef(props, 'label')
  const   computedLabel = computed(() => label.value || t(name.value))

  const rules = readFieldRules({ props, t, computedLabel })

  const { value: inputValue, errorMessage, handleBlur, handleChange, meta } = useField(name, rules);

  return { t, handleChange, handleBlur, errorMessage, inputValue, meta, locale };
}

function validator (value) {
  const { rows, rules } = value || {}

  return isRowsValid(rows) && isRulesValid(rules)
}

function isRulesValid(value){
  return typeof value === 'undefined' || isFunction(value) || isPlainObject(value)
}

function isRowsValid(rows){ return Number.isInteger(rows) }

function defaultOptions (rawProps) { return ({ rows: '3', rules : undefined }) }
</script>

<style  scoped>
.TextArea {
  position: relative;
  margin-bottom: calc(1em * 1.5);
  width: 100%;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
}

textarea {
  border-radius: 5px;
  border: 2px solid transparent;
  padding: 15px 10px;
  outline: none;
  background-color: #f2f5f7;
  width: 100%;
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
}

textarea:focus {
  border-color: var(--vv-primary-color);
}

.TextArea.has-error textarea {
  background-color: var(--vv--error-bg-color);
  color: var(--vv--error-color);
}

.TextArea.has-error textarea:focus {
  border-color: var(--vv--error-color);
}

.TextArea.has-error .help-message {
  color: var(--vv--error-color);
}

.TextArea.success textarea {
  background-color: var(--vv--success-bg-color);
  color: var(--vv--success-color);
}
</style>