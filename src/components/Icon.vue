<template >
  <svg :class="{ [`chm-icon-${name}`]:true }" class="chm-icon" >
    <use  v-bind="{ 'xlink:href': `#chm-icon-${name}` }"></use>
  </svg>
</template>
<script>
export default {
  name : 'Icon',
// #region snippet
  props : { name : { type: String, required: true } }
// #endregion snippet
}
</script>
<style>
.chm-icon {
  display     : inline-block;
  width       : 1em;
  height      : 1em;
  stroke-width: 0;
  stroke      : currentColor;
  /* fill        : currentColor; */
}
</style>