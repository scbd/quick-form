<template>
  <div v-if="isAdmin" class="form-check check-input" :class="{ 'has-error': !!(errorMessage && meta.touched), success: meta.valid }" >

    <label :for="name" style="margin-left: -1.25rem;">{{ computedLabel }}</label>

    <input
      :name="name"
      :id="name"
      type="checkbox"
      @change="change(value)"
      class="form-check-input" 
      :value="inputValue"
      style="margin-top:5px;"
    />
    <label class="form-check-label text-muted" :for="name" style="margin-top:5px;">
      {{placeholder || t(`${name}.placeholder`)}}
    </label>
    <p class="help-message" v-show="(errorMessage && meta.touched) || meta.valid">
      {{ errorMessage  }}
    </p>
  </div>
</template>

<script>
import { toRefs,  computed } from 'vue'
import { useField       }            from 'vee-validate'
import { useI18n        }            from 'vue-i18n'
import { readFieldRules }            from '../../composables/schema-validation'
import   isFunction                  from 'lodash.isfunction'
import   isPlainObject               from 'lodash.isplainobject'
import { useMeStore     }            from '../../composables/stores/me'

export default {
  name    : 'CheckBoxControl',
  props   : {
              name          : { type: String, required: true },
              formCtx       : { type: Object, required: true },
              value         : { type: [ String, Number, Date, Object ], default: '' },
              label         : { type: String, default: '' },
              placeholder   : { type: String, default: '' },
              options       : { type: Object, default: defaultOptions, validator }
            },
  methods : { change },
  computed: { isAdmin },
  setup
};

function setup(props) {
    const { t }           = useI18n( { useScope: 'global' })
    const { name, label , options } = toRefs(props);

    const   computedLabel = computed(() => label.value || t(name.value))
    const   me            = useMeStore()

    const { uncheckedValue, checkedValue } = options.value;


    const { value: inputValue, meta, errorMessage} = useField(name, undefined, {
      type: "checkbox",
      checkedValue: checkedValue, uncheckedValue,
    });

    return { t, inputValue, checkedValue, uncheckedValue, computedLabel, me, meta, errorMessage}
}

function change(){
  if(!this.inputValue) this.inputValue = this.checkedValue
  else this.inputValue = this.uncheckedValue
}

function isAdmin(){
  if(!this.options.adminOnly) return true

  if(!this.formCtx?.user) return false

  return this.me.isAdmin(this.formCtx.schema)
}

function defaultOptions () {
  return ({ 
            rules: undefined,
          }) 
}

function validator (value) {
  const { type, rules } = { ...(value || {}), ...{ type: 'checkbox', rules: undefined } }

  return true
}

function isRulesValid(value){

  return typeof value === 'undefined' || isFunction(value) || isPlainObject(value)
}
</script>

<style  scoped>
.check-input {
  position: relative;
  margin-bottom: calc(1em * 1.8);
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