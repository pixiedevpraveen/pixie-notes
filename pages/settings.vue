<script setup lang="ts">
import { useSetting } from '@/composables/store';
import { emailHide, strCamelSplit } from "@/composables/utils";
import { usePbAuth } from "@/composables/pb";
import { useAuthUser } from '@/composables/authUser';

const localStore = useLocalStore()
const setting = useSetting()
const store = useStore()
const auth = usePbAuth()
const authUser = useAuthUser()
const mutation = useMutation()
const updates = useUpdates()

const localKeys = ref<string[]>([])

onMounted(async () => {
    localKeys.value = (await localStore._el.keys()).keys
})

let timeoutId: ReturnType<typeof setTimeout>

watch(setting, (v, p) => {
    if (!p) return
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
        await localStore.setItem('setting', v)
    }, 500);
}, { deep: true })

function handleLogin(e: MouseEvent) {
    const email = (document.getElementById("auth-email") as HTMLInputElement).value
    const password = (document.getElementById("auth-password") as HTMLInputElement).value
    auth.login(email, password)
        .then((r) => {
            if (r) {
                mutation.setMsg("You're authenticated.")
                mutation.closeDialog('settings.login')
                auth.updateAuthUser()
            } else throw new Error()
        }).catch((err) => {
            mutation.setMsg("Unable to authenticate." + err.message)
        });
}

async function clearCache(key: string) {
    await localStore._el.remove({ key })
    localKeys.value = localKeys.value.filter(k => k !== key)
}

</script>

<template>
    <div class="page">
        <OuiPage title="Settings">
            <template #viewing>
                Settings
            </template>
            <template #header>
                <div class="d-flex text-center align-items-center scroll-y-auto">
                    <icon name="previous" class="pointer m-2 mx-3" @click="$router.back()" />
                </div>
            </template>
            <template #interaction>
                <div class="d-flex flex-column gap-1 py-2">
                    <oui-list-card :title="authUser.name" :img="authUser.avatar || '/icons/user.svg'" alt="user avatar"
                        class="pointer shadowed"
                        :text="[authUser.username, authUser.emailVisibility ? authUser.email : emailHide(authUser.email)]"
                        @click="mutation.openDialog('settings.login')" />
                    <div v-for="(v, k) in setting" :key="k" class="mx-3">
                        <!-- <oui-json-input :name="k" :value="setting[k]" /> -->
                        <template v-if="/* v?.hidden &&  */k.startsWith('_') && !store.dev"></template>
                        <oui-switch v-else-if="(/* v.__type ||  */typeof v.value) === 'boolean'"
                            :checked="setting[k].value" :id="k" :label="strCamelSplit(k.replace('_', ''))"
                            labelClass="text-upper-first"
                            @change="e => (setting[k].value as unknown as boolean) = e.target.checked"
                            :readonly="v.readonly"></oui-switch>
                        <oui-input type="text" v-else-if="(typeof v.value === 'string')" :value="(v.value as string)"
                            :id="k" :label="strCamelSplit(k.replace('_', ''))" labelClass="text-upper-first"
                            @change="(e) => v.readonly || ((setting[k].value as unknown as string) = e.target.value)"
                            :readonly="v.readonly"></oui-input>
                    </div>
                    <oui-list-card title="App Data" alt="user avatar" class="pointer shadowed" :text="['Notes, Setting']"
                        @click="mutation.openDialog('settings.cache')" />

                    <oui-list-card title="Updates" alt="user avatar" class="pointer shadowed text-upper-first"
                        :text="updates.settings.map(k => k.name)" @click="mutation.openDialog('settings.updates')" />
                </div>
                <OuiDialog name="settings.login" closeBtn="Close" title="User Authentication">
                    <oui-input type="email" :value="authUser.email" id="auth-email" label="Email" name="email"></oui-input>
                    <oui-password-input id="auth-password" label="Password" name="password"></oui-password-input>
                    <template #action>
                        <div class="oui-dialog-divider"></div>
                        <a href="#" class="oui-dialog-action-link" @click="handleLogin">{{ 'Login' }}</a>
                    </template>
                </OuiDialog>
                <OuiDialog name="settings.cache" closeBtn="Close" title="App Data">
                    <div class="d-flex justify-content-between gap-1 mt-1" v-for="key of localKeys" :key="key">
                        <strong class="text-upper-first">{{ strCamelSplit(key) }}</strong>
                        <button class="oui-button small" @click="clearCache(key)">Clear</button>
                    </div>
                </OuiDialog>
                <OuiDialog name="settings.updates" closeBtn="Close" title="Updates">
                    <div class="d-flex justify-content-between gap-1 mt-2" v-for="update in updates.settings"
                        :key="update.name">
                        <strong>{{ update.name }}</strong>
                        <button class="oui-button small" :disabled="update.done"
                            @click="e => { (e.target as HTMLButtonElement).disabled = true; update.action() }">Run</button>
                    </div>
                </OuiDialog>
            </template>
        </OuiPage>

        <!-- <lock-dialog v-if="!verified" :onVerify="() => verified = true" id="notes-protect" /> -->
    </div>
</template>
