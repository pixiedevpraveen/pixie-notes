<template>
    <div class="oui-badge" :class="{ 'oui-badge-placement': badge }">{{ text }}</div>
</template>

<script setup lang="ts">
defineProps({
    text: {
        type: String,
        required: true
    },
    badge: { type: Boolean, default: true }
})
</script>
