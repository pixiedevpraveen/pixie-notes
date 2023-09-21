<template>
    <Transition name="opacity">
        <div class="oui-dialog-mask" v-show="store.dialog.includes(name)" @click="mutation.closeDialog(name)"></div>
    </Transition>

    <Transition name="show">
        <div class="oui-dialog" v-if="store.dialog.includes(name)">
            <div class="oui-dialog-header">
                {{ title }}
            </div>
            <div class="oui-dialog-description">
                <slot />
            </div>
            <div class="oui-dialog-action">
                <a href="#" class="oui-dialog-action-link"
                    @click="onClose ? onClose() : mutation.closeDialog(name)">{{ closeBtn || 'Done' }}</a>
                <slot name="action">
                </slot>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
defineProps<{ name: string, title: string, closeBtn?: string, onClose?: () => void }>()
const store = useStore()
const mutation = useMutation()
</script>

<style scoped>
.oui-dialog-mask,
.oui-dialog {
    transition: all var(--transition);
}

.oui-dialog {
    transform: translate(-50%, 0);
}

.show-enter-active,
.show-leave-active {
    transition: all var(--transition-fast);
}

.show-enter-from,
.show-leave-to {
    opacity: 0;
    transform: translate(-50%, 120vh);
}
</style>
