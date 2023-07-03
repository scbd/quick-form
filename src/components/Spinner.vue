
<template >
<div class="cont">
  <div class="lds-ring" :style="{width:`${Number(props.size)+5}px`, height:`${Number(props.size)+5}px`}">
    <div :style="{'border-width':`${(props.size/100)*3}px`,'border-top-color':props.color}"/>
    <div :style="{'border-width':`${(props.size/100)*3}px`,'border-top-color':props.color}"/>
    <div :style="{'border-width':`${(props.size/100)*3}px`,'border-top-color':props.color}"/>
    <div :style="{'border-width':`${(props.size/100)*3}px`,'border-top-color':props.color}"/>
  </div>
  <div class="slot-hold">
    <slot/>
  </div>
</div>
</template>
<script>


export default {
  name      : 'Spinner',
  props : { 
            size  : { type: number, required: true, default: () => 100 },
            color : { type: String, required: true, default: ()=> '#039749' }
          }
}
</script>

<style scoped>
.cont{ position: relative; width: 45px; height: 47px; background-color: transparent;}
.slot-hold{ position: absolute;   top: 55%; left: 50%; transform: translate(-50%, -50%);}

.lds-ring {  display: inline-block; position: relative; width: 30px; height: 30px; margin-bottom:-5px; }
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 95%;
  height: 95%;
  margin: 3px;
  border: 3px solid;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) { animation-delay: -0.45s; }
.lds-ring div:nth-child(2) { animation-delay: -0.3s; }
.lds-ring div:nth-child(3) { animation-delay: -0.15s; }
@keyframes lds-ring {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
