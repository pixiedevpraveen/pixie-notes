<template>
    <label class="oui-label oui-container-input" :for="id" :class="parentClass">
        <span class="p-2 font-2x" v-if="label">{{ label }}</span>
        <input :id="id" :type="type" class="oui-input-text"
            v-bind="$attrs">
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, parentClass?: string, id: string, type: string }>()
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

</style>
