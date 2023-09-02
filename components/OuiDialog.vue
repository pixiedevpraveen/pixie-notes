<template>
    <Transition name="opacity">
        <div class="oui-dialog-mask" v-if="store.dialog.includes(name)"></div>
    </Transition>

    <div class="oui-dialog" :class="{ 'show': store.dialog.includes(name) }">
        <div class="oui-dialog-header">
            {{ title }}
        </div>
        <div class="oui-dialog-description">
            <slot />
        </div>
        <div class="oui-dialog-action">
            <a href="#" class="oui-dialog-action-link"
                @click="onClose ? onClose() : store.dialog.pop()">{{ closeBtn || 'Done' }}</a>
            <slot name="action">
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const store = useStore()
const { name } = defineProps<{ name: string, title: string, closeBtn?: string, onClose?: () => void }>()

</script>

<style scoped>
.oui-dialog-mask,
.oui-dialog {
    transition: all var(--transition);
}

.oui-dialog:not(.show) {
    transform: translate(-50%, 120vh);
}
</style>
