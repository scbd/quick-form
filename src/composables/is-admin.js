import { computed   } from 'vue-demi';
import { useMeStore } from '@/composables/stores/me';

export default computed(isAdminFunction)

function isAdminFunction(){
    const user   = useMeStore();
    const admins = [ 'Administrator', 'idb-admin' ];

    return user.isAdmin({admins});
}