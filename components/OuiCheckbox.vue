<template>
    <label class="oui-label oui-container-checkbox" :for="id">
        <span class="oui-input-text">{{ label }}</span>
        <input :id="id" type="checkbox" class="oui-input-checkbox" :checked="checked"
            @click="e => $emit('update:checked', (e.target as HTMLInputElement).checked)">
        <span class="oui-input-checkbox-checkmark"></span>
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, checked: boolean, id: string }>()
defineEmits(['update:checked'])
</script>
