<template>
    <section>
        <div v-if="match" class="col-12 m-0 p-0">
            <iframe class="youtube-video" :src="`https://www.youtube.com/embed/${match}`" :title="title" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </section>
</template>
<script setup>
    import { defineProps, toRefs, ref } from 'vue';
    import axios     from 'axios';

    const   props  = defineProps({ url: { type: String }, title: { type: String } });
    const { url, title }  = toRefs(props);

    const ombedUrl = 'https://www.youtube.com/oembed?format=json&url=' + url.value;
    const ombedHtml = ref('')
    const pattern = /src="https:\/\/www.youtube.com\/embed\/([^?]+)\?feature=oembed"/;
    const match = ref(null);

    axios.get(ombedUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } }).then((r)=> {
        ombedHtml.value = r.data;

        const matches = ombedHtml.value.html.match(pattern);

        match.value= matches? matches[1] : null;
    });

   

    // const matches = ombedHtml.value.html.match(pattern);
    //const match   = matches? ref(matches[1]) : ref(null);
</script>
<style lang="scss" scoped>
.youtube-video {
    aspect-ratio: 16 / 9;
    width: 100%;
}
</style>