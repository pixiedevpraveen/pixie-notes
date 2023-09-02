<script setup lang="ts">
import snarkdown from "snarkdown";
const { name, content } = defineProps<{ name: string, content: string }>()
const md = ref(content)

const id = `tinymce-` + name

function toHtml(str: string) {
    return snarkdown(str)
}

</script>

<template>
    <textarea class="py-2" :name="name" :id="id" v-model="md"></textarea>
    <div id="html-preview" v-html="toHtml(md)"></div>
</template>

<style scoped>
@import "@/assets/css/pcoder-mini.css";
@import "@/assets/css/pcoder-style.css";
textarea {
    height: 50%;
}
</style>
