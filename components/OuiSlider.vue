<template>
    <label class="oui-label oui-container-slider" :for="id" :class="parentClass">
        <span>{{ label }}</span>
        <input :id="id" type="range" class="oui-input-slider" v-bind="$attrs">
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, parentClass?: string, id?: string }>()
</script>
