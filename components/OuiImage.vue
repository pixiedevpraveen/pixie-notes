<template>
    <div class="oui-bubble">
        <img :src="src" class="oui-image-cover" :alt="alt" />
        <p class="oui-image-cover-caption">{{ caption }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{ src: string, alt?: string, caption?: string }>()
</script>
