
<template>
  <iframe v-once v-if="url" id="authFrame" style="display:none;" ref="authFrame" :src="`${url}/app/authorize.html`"/>
</template>

<script>


export default {
  name : 'AuthIframe',
  props: {
    url: { type: String }
  }
}


</script>

