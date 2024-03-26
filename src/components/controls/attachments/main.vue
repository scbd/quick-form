<template>
    <div class="form-group attachments" :class="{ 'has-error': !!errorMessage, success: meta.valid }" >
      <label :for="name">{{ t(name)}}</label>
      <div class="card">
        <div class="card-body bgc">

          <div class="links">
            <p v-if="!this.inputValue" class="placeholder-message" > {{ t(`${name}.placeholder`) }} </p>

            <div v-if="!options.multiple && (previewSrc || inputValue)" class="row">
              <div class="col text-center">
                
                <YouTube v-if="isYoutube(getUrl())" :url="getUrl()" :title="inputValue?.caption[locale]" class="col my-auto"/>


                <div v-if="!isImage(getUrl()) && !isYoutube(getUrl())">
                  <Icon  name="file" style="width: 3em; height: 3em;"/> <br/>
                  <span v-if="isTemporary(getUrl())" class="text-muted">{{ inputValue?.name[locale] }}</span>
                  <a v-if="!isTemporary(getUrl())" :href="getUrl()" target="_blank" rel="noopener noreferrer"> <Icon name="external-link" style="position: relative; margin-right: .5em;top:3px;"/>{{ inputValue?.name[locale] }}</a>
                </div>

                <div v-if="isImage(getUrl())">
                  <img v-if="getSrc()" class="img-preview" :src="getSrc()" /><br/>

                  <span v-if="isTemporary(getUrl())" class="text-muted">{{ inputValue?.caption[locale] }}</span>
                  <a v-if="!isTemporary(getUrl())" :href="getUrl()" target="_blank" rel="noopener noreferrer"> <Icon name="external-link" style="position: relative; margin-right: .5em;top:3px;"/>{{ inputValue?.caption[locale] }}</a>
                </div>
                <!-- <img v-if="previewSrc" class="img-preview" :src="previewSrc" />
                <img v-if="!previewSrc && isImageUrl(inputValue?.contentUrl)" class="img-preview" :src="inputValue?.contentUrl" />
                <Icon v-if="!previewSrc && !isImageUrl(inputValue?.contentUrl)" name="file" style="width: 3em; height: 3em;"/>
                <br/>
                
                <div v-if="isImageUrl(inputValue?.contentUrl)">
                  <span v-if="previewSrc" class="text-muted">{{ inputValue?.caption[locale] }}</span>
                  <a v-if="!previewSrc" :href="inputValue?.contentUrl" target="_blank" rel="noopener noreferrer"> <Icon name="external-link" style="position: relative; margin-right: .5em;top:3px;"/>{{ inputValue?.caption[locale] }}</a>
                </div>
                  -->
              </div>
              <div class="col-1 text-center" style="margin: auto;">
                  <button @click="remove()" class="btn"><Icon name="trash"/></button>
              </div>
            </div>

            <div v-if="options.multiple && inputValue?.length">
              <div v-for="(row, $index) in inputValue" :key="$index" class="row" >
                <YouTube v-if="isYoutube(getUrl(row))" :url="getUrl(row)" :title="row?.name[locale]" class="col my-auto"/>

                <div v-if="!isYoutube(getUrl(row))" class="col-2 text-center">
                  <img v-if="isImage(getUrl(row))" class="img-preview" :src="getSrc(row)" />
                  <!-- <img v-if="isDataUrl(row.contentUrl) || isImageUrl(row.contentUrl)" class="img-preview" :src="dataUrl(row.contentUrl)" /> -->

                  <Icon v-if="!isImage(getUrl(row))" name="file" style="width: 3em; height: 3em;"/>
                </div>
                <div v-if="!isYoutube(getUrl(row))" class="col my-auto" style="margin: auto;">
                  <div v-if="isImage(getUrl(row))">
                    <span v-if="isTemporary(getUrl(row))">{{ row.caption[locale] }}</span>
                    <a v-if="!isTemporary(getUrl(row))" :href="getUrl(row)" target="_blank" rel="noopener noreferrer"> <Icon name="external-link" style="position: relative; margin-right: .5em;top:3px;"/>{{ row?.caption[locale] }}</a>
                  </div>

                  <div v-if="!isImage(getUrl(row))">
                  <span v-if="isTemporary(getUrl(row))" class="text-muted">{{ row?.name[locale] }}</span>
                  <a v-if="!isTemporary(getUrl(row))" :href="getUrl(row)" target="_blank" rel="noopener noreferrer"> <Icon name="external-link" style="position: relative; margin-right: .5em;top:3px;"/>{{ row?.name[locale] }}</a>
                </div>
                </div>
                <div class="col-1 text-center" style="margin: auto;">
                  <button @click="remove($index)" class="btn"><Icon name="trash"/></button>
                </div>
                <div class="col-12 text-center" style="margin: auto;">
                  <hr/>
                </div>
                
              </div>
            </div>

            <div v-if="showButtons">
              <button v-if="showUrlButton"  type="button" class="btn btn-secondary btn-sm mr-3" @click="toggleLinkForm"> {{ t('Add link') }} </button> 
              <button v-if="showFileButton" type="button" class="btn btn-secondary btn-sm"      @click="toggleFileForm"> {{ t('Add file') }} </button>
            </div>
          </div>

          <LinkForm @input="addLink" :name="name" :show="showLinkForm" :options="options" @close-link-form="toggleLinkForm"/>
          <FileForm @input="addLink" :name="name" :show="showFileForm" :options="options" @close-file-form="toggleFileForm" @addPreviewBlob="addPreviewBlob"/>
        </div>
      </div>
      <p class="help-message" v-show="errorMessage || meta.valid">
        {{ errorMessage  }}
      </p>
    </div>
</template>

<script>
import { toRef          , computed }    from 'vue'
import { useField       }               from 'vee-validate'
import { useI18n        }               from 'vue-i18n'
import   isFunction                     from 'lodash.isfunction'
import   isPlainObject                  from 'lodash.isplainobject'
import   YouTube     from '@/components/you-tube.vue';

import isEmpty from 'lodash.isempty'
import { readFieldRules }               from '@/composables/schema-validation'
import { isImageUrl     }               from '@/composables/images'
import { imageOnly     , nonImageOnly } from './composables/computed'
import   lodashGet      from 'lodash.get'

import Icon      from '../../Icon.vue'
import   LinkForm   from './link-form.vue'
import   FileForm   from './file-form.vue'

export default {
  name      : 'AttachmentControl',
  components: { YouTube, LinkForm, FileForm, Icon },
  props: {
            name          : { type: String, required: true },
            formCtx       : { type: Object, required: true },
            value         : { type: [ Object, Array ], default : undefined },
            label         : { type: String, default: '' },
            placeholder   : { type: String, default: '' },
            options       : { type: Object, default: defaultOptions, validator }
        },
  computed: { showFileButton, showUrlButton, showButtons, imageOnly, nonImageOnly,  },
  methods : { isYoutube,toggleLinkForm, toggleFileForm, addLink, addPreviewBlob, getDataUrl, remove, hasPreview, isImage, getUrl, isTemporary, getSrc },
  setup, data
}

function setup(props) {
  const { t, locale }   = useI18n({ useScope: 'global' })
  const   name          = toRef(props, 'name')
  const   label         = toRef(props, 'label')
  const   computedLabel = computed(() => label.value || t(name.value))

  const rules = readFieldRules({ props, t, computedLabel })

  const { value: inputValue, errorMessage, handleBlur, handleChange, meta, } = useField(name, rules, { initialValue: props.value, });

  return { handleChange, handleBlur, errorMessage, inputValue, meta, t, locale };
}

function data(){
  return {
    showLinkForm: false,
    showFileForm: false,
    inputValue: this.value || (this.multiple? [] : {}),
    previewSrc: undefined
  }
}

function addLink(value){
  console.log('add link', value)
  const targetValue = lodashGet(value, this.name)

  if(!targetValue) return

  this.inputValue = this.options?.multiple? [ ...(this.inputValue || []), targetValue ] : targetValue

  if(!this.inputValue) return

  this.$emit('input', this.inputValue)
}

function addPreviewBlob(value){
  if(!this.options?.multiple) return this.previewSrc = value.previewSrc

  if(!this.previewSrc) this.previewSrc = {}

  this.previewSrc[ value.contentUrl ] = value.previewSrc
}

function getDataUrl(url){
  if(!this.previewSrc) return url
  
  if(this.previewSrc[url]) return this.previewSrc[url]

  return url
}

function isTemporary(url){
  return url.includes('cbd.documents.temporary')
}

function getUrl({ url, contentUrl } = this.inputValue || {}){
  if(!url && !contentUrl) throw new Error('No contentUrl or url in attachment')

  return url || contentUrl
}
function getSrc({ url, contentUrl } = this.inputValue || {}){
  const theUrl     = contentUrl || url

  if(!this.previewSrc) return theUrl

  const previewSrc = this.options.multiple? this.previewSrc[theUrl] : this.previewSrc

  return previewSrc || theUrl
}

function isImage(url){
  if(this.nonImageOnly || this?.options?.imageOrYoutubeOnly) return false

  return this.imageOnly || this.hasPreview(url) || isImageUrl(url)
}

function isYoutube(url){
  if(!this?.options?.imageOrYoutubeOnly && !this.options?.multiple) return false
  const regx = /^https?:\/\/(?:www\.)?(youtube\.com|youtu.be).*$/i

  return regx.test(url)
}

function hasPreview(url){
  if(!this.previewSrc) return false

  if(this.previewSrc[url]) return true

  return false
}

function showButtons(){
  const { multiple } = this.options || {}

  return multiple || (!multiple && isEmpty(this.inputValue))
}

function toggleLinkForm(){ 
  this.showLinkForm = !this.showLinkForm;
  this.showFileForm = false;
}

function toggleFileForm(){ 
  this.showFileForm = !this.showFileForm;
  this.showLinkForm = false;
}


function showFileButton(){
  return ['file', 'both'].includes(this.options?.type)
}

function showUrlButton(){
  return ['url', 'both'].includes(this.options?.type)
}

function defaultOptions (rawProps) {
  return ({ type : 'both', multiple: false, imageOnly: false, nonImageOnly: false }) 
}

function validator (value) {
  const { type, rules } = value || {}

  return isTypeValid(type) && isRulesValid(rules)
}

function isTypeValid(type){
  if(!type || !(typeof type === 'string' || type instanceof String)) return false

  return [ 'file', 'url', 'both' ].includes(type)
}

function isRulesValid(value){
  return typeof value === 'undefined' || isFunction(value) || isPlainObject(value)
}

function remove(index){
  const { multiple } = this.options || {}

  if(!multiple) {
    this.inputValue = undefined
    this.previewSrc = undefined
    this.$emit('input', this.inputValue)
    return
  }

  this.inputValue.splice(index,1)
  this.$emit('input', this.inputValue)
}
</script>

<style  scoped>

.img-preview { max-height: 20vh; }
.pt-0 {
  padding-top: 0 !important;
  padding-left: .75em !important;
}
.mr-3 { margin-right: .75em !important; }
.bgc{ background-color: #f2f5f7; }
.attachments {
  position: relative;
  margin-bottom: calc(1em * 1.5);
  width: 100%;
}

.placeholder-message {
  color: rgb(117, 117, 117);
  font-size: 14px;
  opacity: .6;
  font-family: "BenchNine", sans-serif;
  margin: 0 0 0 0;
  padding-bottom: 1em;
}

.attachments.has-error input {
  background-color: var(--vv--error-bg-color);
  color: var(--vv--error-color);
}

.attachments.has-error input:focus {
  border-color: var(--vv--error-color);
}

.attachments.has-error .help-message {
  color: var(--vv--error-color);
}
</style>