<template>

  <SignInUp :options="formCtx.schema"/>
  <UseAccountControlBox v-if="me.isAuthenticated && !formCtx.identifier" v-bind="$props" />

</template>
  
  <script>
  import { toRefs               } from 'vue-demi'
  import { useMeStore           } from '@/composables/stores/me'
  import   SignInUp               from './sign-in-up.vue'
  import   UseAccountControlBox   from './use-account-control-box.vue'

  export default {
    name       : 'UseAccountControl',
    components : { SignInUp, UseAccountControlBox },
    props      : {
                    name          : { type: String, required: true },
                    formCtx       : { type: Object, required: true },
                    value         : { type: [ String, Number, Date, Object, Boolean ], default: false },
                    label         : { type: String, default: '' },
                    placeholder   : { type: String, default: '' },
                    options       : { type: Object, default: defaultOptions }
                },
    setup
  };
  
  function setup(props) {
      const { formCtx } = toRefs(props);
      const   me        = useMeStore()

      return { me, formCtx }
  }

  function defaultOptions () { return ({ })  }

  </script>
