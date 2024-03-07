import { ref  } from 'vue';
import { useMeStore } from '@/composables/stores/me';
import   intersect     from 'lodash.intersection';

const isAdmin = ref(false);

export default isAdmin


function isAdminFunction(){

    const meStore    = useMeStore();
    const admins  = [ 'Administrator', 'idb-admin' ];

    isAdmin.value = meStore.isAdmin({admins})

    meStore.$subscribe((m, s) => {
        if(m.payload.userID && m.payload.userID === 1) return isAdmin.value = false;
        if(m.payload?.profile?.UserID && m.payload.profile.UserID === 1) return isAdmin.value = false;

        if(!Array.isArray(admins) || !Array.isArray(s.roles) ) return false

        isAdmin.value = !!intersect(s.roles, admins).length

    })

    return isAdmin;
}
isAdminFunction()