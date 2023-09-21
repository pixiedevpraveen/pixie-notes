<script setup lang="ts">
const { id, onVerify } = defineProps<{ id: string, onVerify: (verified: boolean) => void }>()
const msg = ref('')
const setting = useSetting()

onMounted(() => {
    document.getElementById(id + 'pass')?.focus()
})

function validatePass(e: Event) {
    const inpt = (e.target as HTMLInputElement).value

    if (!inpt || inpt.length < 4) {
        msg.value = "Enter a Password with at least 4 characters in it"
    } else if (inpt.length >= 16) {
        msg.value = "Can't enter more than 16 characters."
    } else {
        msg.value = ""
    }
}
function handleSubmit(e: Event) {
    const pass = (e.target as HTMLFormElement).appPassword.value
    if (!pass) return
    onVerify(pass === setting.value.noteUnlockMethods.value.password.value)
}
</script>

<template>
    <div class="protected-page">
        <div class="p-3">
            <h2 class="font-3x">Confirm paassword</h2>
        </div>
        <div class="oui-bubble py-5">
            <div class="text-center">
                <strong class="font-2x">{{ msg || 'Enter your password.' }}</strong>
            </div>
            <form @submit.prevent="handleSubmit">
                <oui-password-input name="appPassword" @keyup="validatePass" :id="id + 'pass'" hide-eye
                    class="bg-transparent outline-0 p-2 font-2x text-center rounded-0" maxlength="16"></oui-password-input>
            </form>
            <div class="text-center">
                <button class="oui-button small">Reset password instead</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.protected-page {
    position: fixed;
    height: 100vh;
    width: 100%;
    top: 0;
    background-color: var(--background);
    z-index: 2001;
}

:deep(input) {
    border: none;
    border-bottom: 2px solid var(--border-color);
}
</style>
