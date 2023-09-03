<template>
    <label class="oui-label oui-container-input" :for="id" :class="parentClass">
        <span class="p-2 font-2x" v-if="label">{{ label }}</span>
        <div class="d-flex p-relative">
            <input :id="id" :type="show?'text':'password'" class="oui-input-text oui-input-password flex-fill" v-bind="$attrs">
            <Icon class="oui-input-password-toggler" @click="show = !show" :name="show ? 'eye-off' : 'eye'" />
        </div>
    </label>
</template>

<script setup lang="ts">
defineProps<{ label: string, parentClass?: string, id: string }>()
const show = ref(false)
</script>

<style scoped>
.oui-input-password-toggler {
    position: absolute;
    right: 0;
    top: 50%;
    translate: 0 -50%;
}
</style>
