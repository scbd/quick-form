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

<script>
  import { toRefs,  computed }  from 'vue-demi';
  import { useField          }  from 'vee-validate';
  import { useMeStore        }  from '@/composables/stores/me';
  import   t  , { getLocale  }  from '@/composables/i18n.js';
  import   Icon                 from '@/components/Icon.vue';
  import   lodashSet            from 'lodash.set';

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
    methods   : { change },
    setup, mounted    
  };

  function setup(props) {

    const { name, label , placeholder, options, value, formCtx, } = toRefs(props);

    const   computedLabel = computed(() => label.value || t(name.value))
    const   me            = useMeStore()

    const { uncheckedValue, checkedValue } = options.value;

    const fieldOptions = { type: "checkbox", checkedValue, uncheckedValue, initialValue:value, valueProp: value }

    const { value: inputValue, meta, errorMessage} = useField(name, undefined, fieldOptions );

    const locale = getLocale();

    return { t, locale,  toggle, placeholder, formCtx,  inputValue, checkedValue, uncheckedValue, computedLabel, me, meta, errorMessage}
}

async function toggle() {
    const { name, email, getProfile } = useMeStore()
    const { Organization: organization,  Country: country, City: city } = await getProfile()
    const { values: formModel } = this.formCtx
    const { map               } = this.options
    const   userValues          = { name, email, organization, country, city }

    for (const key of Object.keys(map)) {
        const isLstring = [ 'name', 'organization' ].includes(key)
        const path      = isLstring? `${map[key]}.${this.locale}` : map[key]
        const value     = this.inputValue? userValues[key] : undefined

        if(key === 'country' ){
            const countryObj = this.inputValue? { identifier: value} : undefined;

            lodashSet(formModel, path, countryObj);
            continue;
        }
        lodashSet(formModel, path, value);
    }
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