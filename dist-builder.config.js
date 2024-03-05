import  DistBuilder from '@scbd/dist-builder'

const { viteConfig,  external:deps, getPackageVersion } = DistBuilder

export const debug   =  true
export const minify  =  true
export const globals = { vue: 'Vue', 'vue-i18n': 'VueI18n'}

export const cdnUrl  = 'https://cdn.jsdelivr.net/npm'

export const widget           = true
export const testWidget       = true
export const includeInBuild   = [ 'vee-validate', 'vue-recaptcha', 'vue-multiselect']

export const importMapOverRide = {
    'axios':'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/esm/axios.js'
    // 'vue-i18n'                                      : `https://cdn.jsdelivr.net/npm/vue-i18n@${getPackageVersion('vue-i18n')}/dist/vue-i18n.esm-browser.prod.js`,
    // 'pinia'                                         : `https://cdn.jsdelivr.net/npm/pinia@${getPackageVersion('pinia')}/dist/pinia.esm-browser.js`,
    // 'vue-demi'                                      : `https://cdn.jsdelivr.net/npm/vue-demi@${getPackageVersion('vue-demi')}/lib/index.mjs`,
    // 'vue'                                           : `https://esm.sh/stable/vue@3.3.0-alpha.4/es2022/vue.js`,
    // 'https://esm.sh/stable/vue@3.2.47/es2022/vue.js': `https://esm.sh/stable/vue@3.3.0-alpha.4/es2022/vue.js`
}

export const importExtras = {
    // 'https://esm.sh/stable/vue@3.2.47/es2022/vue.js': `https://esm.sh/stable/vue@3.3.0-alpha.4/es2022/vue.js`,
    // '@vue/devtools-api'                             : `https://esm.sh/@vue/devtools-api@^6.5.0`,
    'json5'                                         : `https://esm.sh/json5@2.2.3`
}

const external = deps.filter((item)=>!includeInBuild.includes(item))

export const distBuilderConfig = {
    widget, testWidget, cdnUrl, external, debug, minify, globals, importMapOverRide, importExtras
}

export const makeViteConfig = () => viteConfig(distBuilderConfig)

export default makeViteConfig