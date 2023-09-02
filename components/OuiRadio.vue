<template>
    <label class="oui-label oui-container-radio" :for="id">
        <input :id="id" type="radio" class="oui-input-radio" name="radio" value="radio1" :checked="checked"
            @click="e => $emit('update:checked', (e.target as HTMLInputElement).checked)">
        <span class="oui-input-text">{{ label }}</span>
        <span class="oui-input-radio-checkmark"></span>
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, checked: boolean, id: string }>()
defineEmits(['update:checked'])
</script>
