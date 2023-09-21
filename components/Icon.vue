<template>
    <span :class="'icon-' + name" :title="name" :style="{ backgroundImage: `url('/icons/${name}.svg')`, color }"></span>
</template>

<script setup lang="ts">
defineProps<{ name: string, color?: string, size?: string }>()
</script>
