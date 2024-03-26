<template>
    <div class="row" v-if="me.isAuthenticated">
        <div class="col-lg-12">

        <div  class="form-group" :id="`group.contact.useAccount`" >
            <div class="form-check-inline">
                <input
                v-model="input.useAccount"
                :value="true"
                type="checkbox"
                id="contact.useAccount"
                :name="'contact.useAccount'"
                class="form-check-input"
                v-on:change="useAccountToggle()"
                >
                <label class="form-check-label align-text-bottom" for="contact.useAccount" >{{'contact.useAccount'}}</label>
            </div>
            <hr>
        </div>

        </div>
    </div>
</template>
<script>
import { computed        } from 'vue'
import { mapState        } from 'pinia'
import { useI18n         } from 'vue-i18n'
import { useAuthStore    } from '@/composables/stores/auth'
import { useMeStore      } from '@/composables/stores/me'
import { useOptionsStore } from '@/composables/stores/options'
import   t                 from '@/composables/i18n.js';
import { useField       }           from 'vee-validate'

export default {
    name      : 'UseAccount',

    methods   : {  onVerify, onExpired, onRender, onError },
    computed  : { ...mapState(useOptionsStore, ['sitekey', 'id']) },
    setup
}

function onVerify(token){
  this.authStore.$patch({ xCaptchaV2Token: token })
}

function onExpired(){
  this.authStore.$patch({ xCaptchaV2Token: '' })
}

function onRender(){
  this.authStore.$patch({ xCaptchaV2Loaded: true })
}

function onError(resp){
  console.error('xCaptchaV2 onError', resp)
}

// function setup(){
//   const { t, locale }  = useI18n({ useScope: 'global' })
//   const { admins }     = useOptionsStore()
//   const   authStore    = useAuthStore()
//   const   me           = useMeStore()
//   const isAdmin        = computed(() =>  me.isAdmin({ admins }));


//   return { t, locale, authStore, isAdmin }
// }

function setupOld(props){
    const   options        = toRef(props, 'options');
    const   setUpFunctions = { t, onChangeFilter, changeStatus, isAdmin, dtFormat, metaFormat };

    getActions(filter).then((responseDocs)=> { 
        documents.value = responseDocs;
        setTimeout(() => {isLoading.value = !isLoading.value }, 1000);
    });

    return { options, documents, filter, isLoading, ...setUpFunctions };
}

function setup(props) {
    const   name          = toRef(props, 'name')
    const   me            = useMeStore()
    const   label         = toRef(props, 'label')
    const   computedLabel = computed(() => label.value || t(name.value))

    const rules = readFieldRules({ props, t, computedLabel })

    //initial value come from form. ... need to handle prop setting
    const { value: inputValue, errorMessage, handleBlur, handleChange, meta } = useField(name, rules);


    return { t, handleChange, handleBlur, errorMessage, inputValue, meta, locale, computedLabel, me };
}
</script>
