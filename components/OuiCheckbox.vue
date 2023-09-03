<template>
    <label class="oui-label oui-container-checkbox" :for="id" :class="parentClass">
        <span class="oui-input-text">{{ label }}</span>
        <input :id="id" type="checkbox" class="oui-input-checkbox">
        <span class="oui-input-checkbox-checkmark"></span>
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, parentClass?: string, id?: string }>()
</script>
