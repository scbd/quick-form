<template >
    <div ref="SignInUp">
        <div  v-if="!isAuthenticated && show"  class="alert alert-warning show" role="alert" >
            <button @click="hide()" type="button" class="close float-right" aria-label="Close">
                <Icon name="cancel"/>
            </button>

            <p v-if="options?.accountsUrl">
                {{ t('You are not signed in with your UN Biodiverity account.') }}  
                {{ t('Optionally') }} <a :href="`${options?.accountsUrl}/signin?returnUrl=${returnUrl}`">{{ t('sign in')}}</a> {{ t('or')}} <a :href="`${options?.accountsUrl}/signup?returnUrl=${returnUrl}`">{{ t('sign up')}}</a>.
            </p>
        </div>
    </div>
</template>

<script>
import { toRef   , ref, computed } from 'vue';
import { isServer      } from '@/composables/ssr.js';
import   isAdmin         from '@/composables/is-admin.js';
import   t               from '@/composables/i18n.js';
import   Icon            from '@/components/Icon.vue';
import { useMeStore }    from '@/composables/stores/me';

export default {
    name      : 'SignInUp',
    components: { Icon },
    props     : { options : { type: Object, required: true } },
    setup, mounted
}

function setup(props){
    const   returnUrl      = ref('');
    const   options        = toRef(props, 'options');
    const   show           = ref(true)
    const   setUpFunctions = { t, isAdmin, hide };
    const   meStore             = useMeStore();
    const   isAuthenticated     = ref(meStore.isAuthenticated);

    meStore.$subscribe((m)=>{

            if(m.payload.userID && m.payload.userID === 1) return isAuthenticated.value = false;
            if(m.payload?.profile?.UserID && m.payload.profile.UserID === 1) return isAuthenticated.value = false;

            return isAuthenticated.value = true
        })
    return { isAuthenticated,  show, options, returnUrl, ...setUpFunctions };
}

function mounted(){
    if(isServer() && !window?.location?.href) return;

    this.returnUrl = encodeURIComponent(window.location.href);
}

function hide(){ return this.show = false }
</script>
<style scoped>
.fade {
    opacity: .9;
    transition: opacity .15s linear;
}
</style>