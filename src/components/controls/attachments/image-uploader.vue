<template>
  <div class="cropper-wrapper" v-if="image.src">
    <div class="vertical-buttons">
      <div @click="zoom(1.25)" class="square-button">
        <Icon :name="'zoom-in'" class="button-svg"/>
      </div>
      <div @click="zoom(.75)" class="square-button">
        <Icon :name="'zoom-out'" class="button-svg"/>
      </div>

      <div @click="rotate(-90)" class="square-button">
        <Icon :name="'rotate-left'" class="button-svg" />
      </div>
      <div @click="rotate(90)" class="square-button">
        <Icon :name="'repeat'" class="button-svg" />
      </div>
      
      <div @click="flip(true, false)" class="square-button">
        <Icon :name="'flip'" class="button-svg" />
      </div>
      <div @click="flip(false, true)" class="square-button">
        <Icon :name="'flip'" class="button-svg" style=" transform: rotate(90deg)" />
      </div>
    </div>

		<cropper
			ref="cropper"
			class="cropper"

			:src="image.src"

      :stencil-props="{ handlers: {}, movable: true, resizable: true,  }"
  
  
      :transitions="true"
      @change="updateSize"
		/>
	</div>

  <div v-if="image.src">
    <button @click="save()" class="btn btn-primary" type="button">Save Edit</button>
    <button @click="reset();$emit('clear-image-form')" class="btn" type="button">Cancel</button>
  </div>
</template>

<script>
import { Cropper          } from 'vue-advanced-cropper'
import { useI18n          } from 'vue-i18n'
import  Icon              from '../../Icon.vue'
import { getImageMimeType } from '@/composables/images'
import { uploadTempFile   } from '@/composables/files'


export default {
  name      : 'ImageUpLoaderControl',
  components: { Cropper, Icon },
  props     : {  value: { type: Object }, },
  emits     : [ 'input', 'clearImageForm' ],
  methods   : { loadImage, zoom , boundaries, rotate, flip, updateSize, reset, save },
  setup, data, mounted, destroyed
}

function data(){ 
  return  { 
            image: { src  : null,   type: null },
            size : { width: null, height: null }
          }
}

function updateSize({ coordinates }) {
  this.size.width  = Math.round(coordinates.width);
  this.size.height = Math.round(coordinates.height);
}

function mounted(){ this.loadImage() }

function setup(){
  const { t, locale }    = useI18n({ useScope: 'global' })

  return { t, locale }
}

function flip(x, y) { this.$refs.cropper.flip(x, y); }

function rotate(angle) { this.$refs.cropper.rotate(angle); }

function boundaries({ cropper  }) {
	return { width: cropper.clientWidth, height: cropper.clientHeight };
}

function zoom(factor){ this.$refs.cropper.zoom(factor); }

function loadImage() {

	if (this.image.src) URL.revokeObjectURL(this.image.src)

	const blob = URL.createObjectURL(this.value.file);

	const reader = new FileReader();

  reader.onload = (e) => {
    this.image = {
      src: blob,
      type: getImageMimeType(e.target.result, this.value.type),
    }
  }
	reader.readAsArrayBuffer(this.value.file);
}

function 	destroyed() {
  if (this.image.src)
    URL.revokeObjectURL(this.image.src)
}

function reset() {
  this.image = { src: null, type: null }
  this.size = { width: null, height: null }
}

function save() {

  const { canvas } = this.$refs.cropper.getResult();

    canvas.toBlob(async blob => {

      const file = new File([blob], this.value.name , { lastModified: this.value.file.lastModified,type: this.image.type })

      const contentUrl = await uploadTempFile(file)

      const fileData = { blob:URL.createObjectURL(file), name: { [this.locale]: this.value.name }, contentUrl, file, encodingFormat: file.type, contentSize: Number(file.size), dateModified: new Date() }

      this.$emit('input', fileData)
    }, this.image.type);
}
</script>

<style  >

/* @import url('https://cdn.cbd.int/vue-advanced-cropper@2.8.1/dist/style.css'); */
.cropper-wrapper{position: relative; width: 100%; height: 100%;
	user-select: none;
	border: solid 1px #eee;
	margin-top: 20px;
	margin-bottom: 20px;
}
.cropper{
  max-height: 50vh;
}

.vertical-buttons {
	position: absolute;
	left:0px;
	top: 0px;

  z-index: 10;
  background-color: black;
  width:100%;
  opacity: .5;
  max-height: 43px;
  text-align: center;
}
.square-button {
	display: inline-flex;
  z-index: 11;
	align-items: center;
	justify-content: center;
	height: 42px;
	width: 42px;
	cursor: pointer;
	transition: background 0.5s;
  padding: 5px 5px 5px 5px;
  margin: 0 2em 1em 2em;
  max-height: 50px; max-width: 50px;
}
.square-button :hover{ 
  opacity: 1;
}
.button-svg{ fill: white; }
.square-button > svg { fill: azure; max-height: 50px; max-width: 50px;}
</style>