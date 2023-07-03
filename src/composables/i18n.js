import { useI18n       } from 'vue-i18n';
import   isPlainObject   from 'lodash.isplainobject';


export default (target)=>{
    if(!target) return ''

    const   $i18n       = useI18n({ useScope: 'global' });
    const { t, locale } = $i18n;

    if (typeof target === 'string' || target instanceof String) 
        return t(target);

    ensureValidLString($i18n, target);

    return (target[locale] || target['en']);
}

export const getLocale = () => {
    const   $i18n    = useI18n({ useScope: 'global' });
    const { locale } = $i18n;

    return locale;
}


function ensureValidLString({ locale }, target){
    if(isPlainObject(target) && (target[locale] || target['en'])) return true;
    
    throw new Error(`@scbd/quick-form.composable.i18n: target translation not a string or lString`);
}