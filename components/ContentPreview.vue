<script setup lang="ts">
const { content } = defineProps<{ content: string }>()
</script>

<template>
    <div id="html-preview" v-html="content"></div>
</template>

<style scoped>
@import "@/assets/css/pcoder-mini.css";
@import "@/assets/css/pcoder-style.css";

div {
    height: 50%;
}
</style>
