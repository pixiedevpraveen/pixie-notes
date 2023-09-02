<template>
    <div class="oui-bubble">
        <p class="oui-overlay-bubble-item">{{ title }}</p>
        <ul>
            <slot />
        </ul>
    </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
