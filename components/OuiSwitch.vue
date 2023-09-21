<template>
    <label class="oui-label oui-container-toggle d-flex justify-content-between" :for="id" :class="parentClass">
        <span :class="labelClass">{{ label }}</span>
        <input :id="id" type="checkbox" class="toggle" v-bind="$attrs">
        <span class="toggle-slider"></span>
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, parentClass?: string, labelClass?: string, id?: string }>()
</script>
