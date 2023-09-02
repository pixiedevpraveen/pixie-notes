<template>
    <label class="oui-label oui-container-input" :for="id">
        <span class="p-2 font-2x" v-if="label">{{ label }}</span>
        <input :id="id" :type="type" :value="value" class="oui-input-text oui-input-password"
            @change="e => $emit('update:value', (e.target as HTMLInputElement).value)">
        <!-- <Icon name="eye" /> -->
    </label>
</template>

<script setup lang="ts">
defineProps<{ label?: string, value?: string, id: string, type: string }>()
defineEmits(['update:value'])
</script>

<style>
.oui-container-input {
    display: flex;
    flex-direction: column;
}

.oui-input-text {
    border-radius: calc(var(--border-radius) * 1.5);
    font-size: 2ch;
    padding: .5rem;
}

.oui-input-password[type=password]::after {
    /* color: red */
    content: '';
    background: url('/icons/eye.svg');
}
</style>
