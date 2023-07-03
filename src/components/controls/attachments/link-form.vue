<template>
  <div v-if="show" class="card top-margin">
      <button @click="$emit('close-link-form')" type="button" class="close float-right" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>

    <div class="card-body">
      <Form   v-slot="{ values, errors, meta }" @submit="onSubmit" >
        <FormErrorSummary v-bind="{ values, errors, meta }">
          <div class="row">
            <div class="col-12">
              <TextInput @change="onChange"    :options="{ type:'url', rules: { format: 'url', required: true } }" :name="`${name}.contentUrl`"  :label="t(`.contentUrl`)" :placeholder="t(`.contentUrl.placeholder`)"  :value="contentUrl" :form-ctx="{ errors, meta, values }" />
              <!-- <TextInput @change="onChange" v-if="!isImage"  :options="{ type:'url', rules: { format: 'url', required: true } }" :name="`${name}.url`"         :label="t(`.url`)"        :placeholder="t(`.url.placeholder`)"         :value="url"        :form-ctx="{ errors, meta, values }"/> -->
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <LString @change.capture="onChange" v-if="isImage"  :options="{ rules: { max: 100, required: true } }" :name="`${name}.caption`" :label="t(`.caption`)" :placeholder="t(`.caption.placeholder`)" :value="caption" :form-ctx="{ errors, meta, values }"/> 
              <LString @change.capture="onChange" v-if="!isImage" :options="{ rules: { max: 100, required: true } }" :name="`${name}.name`"    :label="t(`.name`)"    :placeholder="t(`.name.placeholder`)"    :value="theName" :form-ctx="{ errors, meta, values }"/>
            </div>
          </div>

          <TextInput @change.capture="onChange" :options="{ type:'hidden', rules: { required: true } }" :name="`${name}.@type`" :label="t(`.@type`)" :placeholder="t(`.@type.placeholder`)" :value="type" :form-ctx="{ errors, meta, values }"/>
        </FormErrorSummary>

        <button class="submit-btn" type="submit">{{t('Add link')}}</button>
        <button class="c-btn" type="button" @click="$emit('close-link-form'); reset();">{{t('Cancel')}}</button>        
      </Form>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent                } from 'vue-demi'
import { useI18n                             } from 'vue-i18n'
import { isImageUrl                          } from '../../../composables/images'
import { imageOnly            , nonImageOnly } from './composables/computed'
import { Form                                } from 'vee-validate'

const TextInput        = defineAsyncComponent(() => import('../text-input.vue'        ))
const LString          = defineAsyncComponent(() => import('../l-string.vue'          ))
const FormErrorSummary = defineAsyncComponent(() => import('../validation-summary.vue'))

export default {
  name      : 'LinkFormAttachmentControl',
  components: { Form, LString, FormErrorSummary, TextInput },
  props     : {
                value      : { type: Object },
                name       : { type: String, required: true },
                show       : { type: Boolean, default: false },
                options    : { type: Object, required: true }
              },
  computed  : { imageOnly, nonImageOnly, isImage },
  methods   : { reset, onSubmit, onChange  },
  setup, data
}


function data(){
  const { forceAtType, imageOnly } = this.options

  const defaultType = imageOnly  ?'ImageObject' : 'CreativeWork'
  const type        = forceAtType? forceAtType : defaultType

  return {
    contentUrl: '',
    url       : '',
    theName   : '',
    caption   : '',
    type
  }
}

function setup(){
  const { t } = useI18n({ useScope: 'global' })

  return { t }
}

function isImage(){
  
  if(this.nonImageOnly) return false

  return this.imageOnly || isImageUrl(this.contentUrl) || isImageUrl(this.url)
}

function onSubmit(value) {
  this.$emit('input', value)
  this.$emit('close-link-form')
}

function onChange(valuePair) {
  if(valuePair.constructor.name === 'Event') return

  if(valuePair.name.endsWith('.url'))        this.url        = valuePair.value
  if(valuePair.name.endsWith('.contentUrl')) this.contentUrl = valuePair.value
  if(valuePair.name.endsWith('.@type'))      this.type       = valuePair.value
  if(valuePair.name.endsWith('.name'))       this.theName    = valuePair.value
  if(valuePair.name.endsWith('.caption'))    this.caption    = valuePair.value

  if(valuePair.name.endsWith('.url') && this.isImage ){
    this.caption    = this.theName
    this.contentUrl = this.url
    this.url = ''
  }
  if(this.isImage && this.type !== 'ImageObject') this.type = 'ImageObject'
}

function reset(){ this.inputValue = this.value || undefined }
</script>

<style  scoped>

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
.top-margin{ margin-top: 1em }
.float-right{ position: absolute; right: 5px; cursor: pointer;}
</style>