<template>
  <ChmComponent :options="options" :schema-name="schemaName" id="quick-form"/>
</template>

<script>
import './style.scss'

import ChmComponent from './components/index.vue';

export default {
  name      : 'App',
  props     : {
    schemaName: { type: String, required: true },
    options   : { type: Object }
  },
  components: { ChmComponent }
};
</script>


