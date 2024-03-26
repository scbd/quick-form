<template>
  <div v-if="show" class="card top-margin">
      <button @click="$emit('close-file-form'); reset();" type="button" class="close float-right" aria-label="Close">
        <Icon name="cancel"/>
      </button>
      
    <div class="card-body">
      <Form  v-slot="{ values, errors, meta }" @submit="onSubmit"  >
        <FormErrorSummary v-bind="{ values, errors, meta }">

          <div v-if="uploaded.previewSrc" class="row">
            <div class="col text-center">
              <img class="img-preview" :src="uploaded.previewSrc" />
              <br/>
              <span class="text-muted">{{ uploaded.savedFileData.name[locale] }}</span>
            </div>
          </div>

          <ImageUpload v-if="isInEditMode" @input="onImageEdit" @clear-image-form="resetImageEditor()" :value="uploaded.file" />

          <div class="text-center" v-if="!isInEditMode && uploaded.file && !isImage">
            <Icon  name="file" class="chm-icon-x3"/>
          </div>
          

          <div class="row" >
            <div class="col-12 text-center">
              <div class="upload-area" v-if="!uploaded.file">
           
                <FileUpload
                  class="alert alert-info"
                  ref="upload"
                  :drop="true"
                  :thread="25"
                  @input-file="onFileUpload"
                  :multiple="false"
                  :extensions="isImage? /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff)$/i : undefined"
                  :accept="isImage? 'image/*' : undefined"
                  >

                  <Icon class="chm-icon-x3" name="cloud-upload"/>

                  <br/>

                  <span>
                    <strong>{{t('Choose') + ' ' + t(imageOnly? 'an image' : 'a file')}}</strong> <br/>
                    <span class="text-muted">{{t('click here')}} </span> 
                    <span class="text-muted" v-if="!noDrop">&nbsp;{{t('or drop it')}}</span>
                  </span>
                </FileUpload>
              </div>

              <TextInput :name="`${name}.contentUrl`"  :value="inputValue.contentUrl"  :label="t(`.contentUrl`)" :placeholder="t(`.contentUrl.placeholder`)" :options="{ type: 'hidden', rules: { required: true } }" :form-ctx="{ errors, meta, values }" />
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <LString v-if="isImage && inputValue.contentUrl"  :options="{ rules: { max: 100, required: true } }" :name="`${name}.caption`" :label="t(`.caption`)" :placeholder="t(`.caption.placeholder`)" :value="inputValue?.caption" :form-ctx="{ errors, meta, values }" />
              <LString v-if="!isImage && inputValue.contentUrl" :options="{ rules: { max: 100, required: true } }" :name="`${name}.name`"    :label="t(`.name`)"    :placeholder="t(`.name.placeholder`)"    :value="inputValue?.name"    :form-ctx="{ errors, meta, values }" />
            </div>
          </div>

          <div>
            <TextInput v-if="inputValue.contentUrl"   :name="`${name}.@type`"    :label="'.@type'" :placeholder="' '" :value="isImage? 'ImageObject': 'CreativeWork'"   :options="{ type: 'hidden', rules: { required: true } }" :form-ctx="{ errors, meta, values }"/>

            <TextInput v-if="inputValue?.dateModified"   :name="`${name}.dateModified`"    :label="' '" :placeholder="' '" :value="inputValue.dateModified"   :options="{ type: 'hidden', rules: { required: true } }" :form-ctx="{ errors, meta, values }"/>
            <TextInput v-if="inputValue?.contentSize"    :name="`${name}.contentSize`"     :label="' '" :placeholder="' '" :value="inputValue.contentSize"    :options="{ type: 'hidden', rules: { type: 'contentSize', max: uploaded.isImage? 300000 : 1000000000, required: true } }" :form-ctx="{ errors, meta, values }"/>
            <TextInput v-if="inputValue?.encodingFormat" :name="`${name}.encodingFormat`"  :label="' '" :placeholder="' '" :value="inputValue.encodingFormat" :options="{ type: 'hidden', rules: { required: true } }" :form-ctx="{ errors, meta, values }"/>
          </div>
          
        </FormErrorSummary>
        
        <button v-show="!isInEditMode && inputValue.contentUrl" class="submit-btn" type="submit"  >{{t('Add file')}}</button>
        <button v-show="!isInEditMode && inputValue.contentUrl" class="c-btn" type="button" @click="$emit('close-file-form'); reset();">{{t('Cancel')}}</button>
      </Form>

    </div>
  </div>
</template>

<script>
import { defineAsyncComponent                } from 'vue'
import { Form                                } from 'vee-validate'
import { useI18n                             } from 'vue-i18n'
import  Icon                                 from '../../Icon.vue'
import { isEncodingImage                     } from '@/composables/images'
import { uploadTempFile      , cleanFileName } from '@/composables/files'
import { imageOnly           , nonImageOnly  } from './composables/computed'

import ImageUpload      from './image-uploader.vue'

const TextInput        = defineAsyncComponent(() => import('../text-input.vue'        ))
const LString          = defineAsyncComponent(() => import('../l-string.vue'          ))
const FormErrorSummary = defineAsyncComponent(() => import('../validation-summary.vue'))
const FileUpload       = defineAsyncComponent(() => import('vue-upload-component'     ))

export default {
  name      : 'FormErrorSummaryControl',
  components: { Form, TextInput, FileUpload, ImageUpload, Icon, FormErrorSummary, LString },
  props     : {
                value   : { type: Object                  },
                name    : { type: String , required: true },
                show    : { type: Boolean, default: false },
                options : { type: Object                  }
  },
  computed  : { isInEditMode, imageOnly, nonImageOnly, isImage },
  methods   : { onSubmit, onFileUpload, reset, onImageEdit, resetImageEditor, hasPreview },
  setup, data
};

function data(){
  const defaultInput = { caption: '', name: '' }

  return { 
            inputValue   : { ...(this.value || {}), ...defaultInput },
            noDrop       : false,
            uploaded     : {
                              file         : undefined,
                              isImage      : false,
                              fileName     : undefined,
                              previewSrc   : undefined,
                              isImageSaved : false,
                              savedFileData: undefined,
                            }
          }
}

function setup(){
  const { t, locale }  = useI18n({ useScope: 'global' })

  return { t, locale }
}

function onSubmit(value) {
  this.$emit('input', value)
  this.$emit('close-file-form')

  if(!this.uploaded?.previewSrc) return this.reset()
  
  const preview = { 
                    previewSrc: this.uploaded.previewSrc,
                    contentUrl: value[this.name].contentUrl
                  }

  this.$emit('add-preview-blob', preview)
  this.reset()
}

function onImageEdit(e){

  const { blob, name, contentUrl, encodingFormat, contentSize, dateModified } = e


  this.uploaded.previewSrc    = blob
  this.uploaded.savedFileData = { name, contentUrl, encodingFormat, contentSize, dateModified }

  this.inputValue             = { ...this.inputValue, name, contentUrl, encodingFormat, contentSize, dateModified }
}

async function onFileUpload(newFile, oldFile) {

  if(isEncodingImage(newFile?.type)) {
    this.uploaded.isImage = true
    this.uploaded.file = newFile 
    return
  }

  this.uploaded.file = newFile 

  const contentUrl = await uploadTempFile(newFile)

  const { name, size, type, lastModifiedDate } = this.uploaded.file

  this.inputValue = { ...this.inputValue, name: cleanFileName(name) , contentUrl, encodingFormat:type, contentSize:Number(size), dateModified: lastModifiedDate }
}

function reset(){
  this.inputValue = this.value || { caption: '', name: '' }
  this.uploaded   = {
                      file         : undefined,
                      isImage      : false,
                      fileName     : undefined,
                      previewSrc   : undefined,
                      isImageSaved : false,
                      savedFileData: undefined,
                    }
}

function resetImageEditor(){
  this.uploaded.file   = undefined
  this.uploaded.isImage= false
}

function isInEditMode(){
  return this.uploaded.file && this.uploaded.isImage && !this.uploaded.savedFileData
}

function isImage(){

  if(this.nonImageOnly) return false

  return this.imageOnly || this.options.imageOnly || this.options.imageOrYoutubeOnly || this.uploaded.isImage
}

function hasPreview(url){
  if(!this.uploaded?.previewSrc) return false

  if(this.uploaded?.previewSrc?.previewSrc[url]) return true

  return false
}
</script>

<style  scoped>
.chm-icon-x3{width:5em;height:5em;}
.img-preview { max-height: 33vh; }
.top-margin{ margin-top: 1em }
.float-right{ position: absolute; right: 5px; cursor: pointer;}
.upload-area > span { cursor: pointer;  z-index:10;}
.upload-area >>> label{ cursor: pointer; }

.c-btn {
  background: rgb(239, 239, 239);
  outline: none;
  border: none;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  width: 100%;
  border-radius: 7px;
  margin-top: 1em;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}
</style>