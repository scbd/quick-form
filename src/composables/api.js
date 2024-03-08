import   axios          from 'axios'
import   consola        from 'consola'
import { useAuthStore } from '../composables/stores/auth'
import { useOptionsStore } from '../composables/stores/options'
import { useErrorStore } from '../composables/stores/error'
import { useFeedbackStore } from '../composables/stores/feedback'
import   isObject       from 'lodash.isplainobject'
import   isNil          from 'lodash.isnil'
import   isEmpty        from 'lodash.isempty'
import   clone          from 'lodash.clonedeep'
import   lodashGet      from 'lodash.get'
import   lodashSet      from 'lodash.set'


export function sanitize(data, sanitizers){
  const dataNilsRemoved = cleanNilsClone (data)

  if(dataNilsRemoved?.meta)
    delete dataNilsRemoved.meta

  if(sanitizers)
    for (const aFilterKey of Object.keys(sanitizers)) {
      const prop      = lodashGet(dataNilsRemoved, aFilterKey)
      const sanitised = Array.isArray(prop)? prop.map(sanitizers[aFilterKey]): sanitizers[aFilterKey](prop)

      lodashSet(dataNilsRemoved, aFilterKey, sanitised)
    }

  return dataNilsRemoved
}

export function cleanNilsClone (obj) {
  return cleanNils(clone(obj))
}

export const getDocument = async (identifier = getIdentifierFromQuery()) => {
  try {
    const { apiUrl }  = await getOptions()
    const headers     = await getAuth()

    if(!identifier) return undefined
    
    const { data } = await axios.get(`${apiUrl}/${encodeURIComponent(identifier)}`, { headers })

    return data
  }
  catch (e){
    const { apiUrl }  = await getOptions()

    if(e.message==='Network Error')
      addError({ name: 'Network Error', message:`There appears to be a network connection error between your computer and the end point`, identifier:apiUrl})

    if(e.response?.status == 404)
      addError({ status: e.response.status, name: e.response.statusText, message:`The document could not be located using identifier`, identifier})

    consola.error('@scbd-chm/form.composables.api.getDocument', e)
  }
}

const defaultSubmitMsg = {
  name: 'You document has been submitted',
  message: 'Your document has been submitted and is waiting review'
}

const defaultEditMsg = {
  name: 'You document has been edited',
  message: 'Your document has been edited and is waiting review'
}

export const postDocument = async (document) => {
  try {
    const { apiUrl, sanitizers, submitMsg } = await getOptions()
    const   headers                         = await getAuth()

    const { status, data } = await axios.post(apiUrl, sanitize(document, sanitizers), { headers })

    const msg = submitMsg || defaultSubmitMsg

    return { data, status, msg }
  }
  catch (e){ 
    const { apiUrl }  = await getOptions()

    if(e.message==='Network Error')
      addError({ name: 'Network Error', message:`There appears to be a network connection error between your computer and the end point`, identifier:apiUrl})

    if(e.response?.status == 403 && e.response?.data?.code==='INVALID_CAPTCHA_SCORE')
      addError({ status: e.response.status, name: e.response.statusText, message:`Your request has been rejected because you failed captcha validation.  Please try again.`})

    if(e.response?.status == 403 )
      addError({ status: e.response.status, name: e.response.statusText, message:`You do not have permission to complete this action`})

    if(e.response?.status == 400)
      addError({ status: e.response.status, name: e.response.statusText, message:`There appears to be an error, the api has not passed validation of the data submitted. Likely due to a missing validation in the form.  Please contact it@cbd.int. `})

    consola.error('@scbd-chm/form.composables.api.postDocument', e)
  }
}

export const putDocument = async (document, identifier = getIdentifierFromQuery()) => {
  try {
    const { apiUrl, sanitizers, editMsg } = await getOptions()
    const   headers              = await getAuth()

    if(!identifier) throw new Error('@scbd-chm/form.composables.api.putDocument: no document identifier specified')
    
    const { status, data } = await axios.put(`${apiUrl}/${encodeURIComponent(identifier)}`,sanitize(document, sanitizers), { headers } )
    
    if(status == 200) addFeedback(editMsg || defaultEditMsg)


    const msg = editMsg || defaultEditMsg
  

    return  { data, status, msg }
  }
  catch (e){
    if(e.message==='Network Error')
      addError({ name: 'Network Error', message:`There appears to be a network connection error between your computer and the end point`, identifier:apiUrl})

    if(e.response?.status == 403 && e.response?.data?.code==='INVALID_CAPTCHA_SCORE')
      addError({ status: e.response.status, name: e.response.statusText, message:`Your request has been rejected because you failed captcha validation.  Please try again.`})

    if(e.response?.status == 403 )
      addError({ status: e.response.status, name: e.response.statusText, message:`You do not have permission to complete this action`})

    if(e.response?.status == 400)
      addError({ status: e.response.status, name: e.response.statusText, message:`There appears to be an error, the api has not passed validation of the data submitted. Likely due to a missing validation in the form.  Please contact it@cbd.int. `})

    consola.error('@scbd-chm/form.composables.api.putDocument', e)
  }
}

export function getIdentifierFromQuery(){
  if (typeof window === 'undefined') return false

  const urlParams  = new URLSearchParams(location.search)

  return urlParams.get('identifier')? encodeURIComponent(urlParams.get('identifier')) : ''
}

async function getAuth(){
  const auth              = useAuthStore()
  const token             = await auth.getToken()

  const authHeaderPair    = token? { Authorization: `Ticket ${token}` } : {}
  const captchaToken      = auth.xCaptchaV2Token
  const captchaHeaderPair = captchaToken? { 'x-captcha-v2-token': captchaToken } : {}

  return { ...authHeaderPair, ...captchaHeaderPair }
}

async function getOptions(){
  const optionsStore = useOptionsStore()

  return optionsStore.$state
}

const needsDeleting = (obj) => isNil(obj) || isEmpty(obj) || objHasOnlyType(obj)

function cleanObject(obj){

  for (const k of Object.keys(obj)) {
    if(isArrayOrObject(obj[k])) obj[k] = cleanNilsClone(obj[k])

    if (needsDeleting(obj[k])) delete obj[k]

    if(isArrayOrObject(obj[k])) obj[k] = cleanNilsClone(obj[k])
  }

  return needsDeleting(obj)? undefined : obj
}

function cleanArray(arr){

  for (let i=0; i<arr.length; ++i) {

    if (isArrayOrObject(arr[i])) arr[i] = cleanNils(arr[i])

    if (needsDeleting(arr[i])) arr.splice(i, 1)

    if (isArrayOrObject(arr[i])) arr[i] = cleanNils(arr[i])
  }

  return uniqueArray(arr)
}

function isArrayOrObject(obj) {
  const isAnArray  = Array.isArray(obj)
  const isAnObject = isObject(obj)

  return (isAnArray || isAnObject) && !isEmpty(obj)
}

function uniqueArray(arr){
  return Array.from(new Set(arr))
}

function objHasOnlyType(obj){
  const isAnObject = isObject(obj) && !isEmpty(obj)
  const hasOneKey  = isAnObject && Object.keys(obj).length === 1
  
  return hasOneKey && Object.keys(obj).includes('@type')
}

function cleanNils (obj) {

  const isAnArray  = Array.isArray(obj)
  const isAnObject = isObject(obj)

  if(!(isAnArray || isAnObject)) throw new Error('@scbd-chm/form.composables.api.clean- param passed to clean is not an object or array')

  if(isAnObject) return cleanObject(obj)
  if(isAnArray) return cleanArray(obj)

  return obj
}


function addError(error){
  const errorStore = useErrorStore()

  errorStore.addError(error)
}

function addFeedback(msg){
  const feedbackStore = useFeedbackStore()

  feedbackStore.addFeedback(msg)

  const errorStore = useErrorStore()

  errorStore.$patch({ errors: [] })
}
