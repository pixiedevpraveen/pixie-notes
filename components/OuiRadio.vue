<template>
    <label class="oui-label oui-container-radio" :for="id" :class="parentClass">
        <input :id="id" type="radio" class="oui-input-radio" name="radio" value="radio1">
        <span class="oui-input-text">{{ label }}</span>
        <span class="oui-input-radio-checkmark"></span>
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, parentClass?: string, id?: string }>()
</script>
