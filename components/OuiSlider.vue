<template>
    <label class="oui-label oui-container-slider" :for="id">
        <span>{{ label }}</span>
        <input :id="id" type="range" class="oui-input-slider" v-bind="$attrs" :value="value"
            @click="e => $emit('update:value', (e.target as HTMLInputElement).value)">
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, value: boolean, id: string }>()
defineEmits(['update:value'])
</script>
