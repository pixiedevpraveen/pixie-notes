<script setup lang="ts">
const { locked, listen, id } = defineProps<{ locked?: boolean, listen?: boolean, id: string }>()
const setting = useSetting()

const show = ref(!setting.value.noteUnlockMethods.enabled || !locked)

function listenVisible() {
    document.addEventListener("visibilitychange", (ev) => {
        if (document.hidden) {
            show.value = false
            rmLs()
        }
    })
}
function rmLs() {
    document.removeEventListener("visibilitychange", () => { })
}
onMounted(() => {
    if (listen)
        listenVisible()
    document.getElementById(id + 'pass')?.focus()
})

onUnmounted(rmLs)

function handleSubmit(verified: boolean) {
    if (verified) {
        listenVisible()
        show.value = true
    }
}
</script>

<template>
    <slot v-if="show" />
    <LockDialog v-else :id="id" :onVerify="handleSubmit">
    </LockDialog>
</template>
