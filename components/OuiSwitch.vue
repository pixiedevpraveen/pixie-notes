<template>
    <label class="oui-label oui-container-toggle d-flex justify-content-between" :for="id">
        <span>{{ label }}</span>
        <input :id="id" type="checkbox" class="toggle" :checked="checked"
            @click="e => $emit('update:checked', (e.target as HTMLInputElement).checked)">
        <span class="toggle-slider"></span>
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, checked?: boolean, id: string }>()
defineEmits(['update:checked'])
</script>
