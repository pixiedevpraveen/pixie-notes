<script setup lang="ts">
import { useSetting } from '@/composables/store';
import { emailHide, strCamelSplit } from "@/composables/utils";

const localStore = useLocalStore()
const setting = useSetting()
const store = useStore()
const mutation = useMutation()

const localKeys = ref<string[]>([])

onMounted(async () => {
    localKeys.value = (await localStore._el.keys()).keys
    if (!setting.value.user.value.id)
        await auth.setUser()
})
// onUnmounted(() => {
// })
let timeoutId: ReturnType<typeof setTimeout>

watch(setting, (v) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
        await localStore.setItem('setting', v)
    }, 500);
}, { deep: true })

function handleLogin(e: MouseEvent) {
    setting.value.authentication.value.token = ''
    auth.login()
        .then((r) => {
            if (r) {
                mutation.setMsg("You're authenticated.")
                mutation.closeDialog('settings.login')
                auth.setUser()
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
    <OuiPage title="Settings">
        <template #viewing>
            Settings
        </template>

        <template #header>
            <div class="d-flex text-center align-items-center scroll-y-auto">
                <icon name="menu" class="medium pointer m-2 mx-3" @click="mutation.openDrawer()" />
            </div>
        </template>

        <template #interaction>
            <div class="d-flex flex-column gap-1 py-2">
                <oui-list-card :title="setting.user.value.name" :img="setting.user.value.avatar || '/icons/user.svg'"
                    alt="user avatar" class="pointer shadowed"
                    :text="[setting.user.value.username, setting.user.value.emailVisibility ? setting.user.value.email : emailHide(setting.user.value.email)]"
                    @click="mutation.openDialog('settings.login')" />

                <div v-for="(v, k) in setting" :key="k" class="mx-3">
                    <!-- <oui-json-input :name="k" :value="setting[k]" /> -->
                    <template v-if="k.startsWith('_') && !store.dev"></template>
                    <oui-switch v-else-if="(/* v.__type ||  */typeof v.value) === 'boolean'" :checked="(v.value as boolean)"
                        :id="k" :label="strCamelSplit(k)"
                        @update:checked="(c: boolean) => (v.value as unknown as boolean) = c"></oui-switch>
                    <oui-input type="text" v-else-if="(typeof v.value === 'string')" :value="(v.value as string)" :id="k"
                        :label="strCamelSplit(k)" @change="(e) => (v.value as unknown as string) = e.target.value"
                        :readonly="v.readonly"></oui-input>
                </div>
                <oui-list-card title="Cache" alt="user avatar" class="pointer shadowed" :text="['Notes, ']"
                    @click="mutation.openDialog('settings.cache')" />
            </div>

            <OuiDialog name="settings.login" closeBtn="Close" title="User Authentication">
                <oui-input type="email" :value="setting.authentication.value.email" id="authentication-email" label="Email"
                    @update:value="(c: string) => setting.authentication.value.email = c"></oui-input>
                <oui-password-input :value="setting.authentication.value.password" id="authentication-password"
                    label="Password" @update:value="(c: string) => setting.authentication.value.password = c"></oui-password-input>
                <template #action>
                    <div class="oui-dialog-divider"></div>
                    <a href="#" class="oui-dialog-action-link" @click="handleLogin">{{ 'Login' }}</a>
                </template>
            </OuiDialog>

            <OuiDialog name="settings.cache" closeBtn="Close" title="Cache">
                <div class="d-flex justify-content-between gap-1 mt-1" v-for="key of localKeys" :key="key">
                    <strong>{{ key }}</strong>
                    <button class="oui-button" @click="clearCache(key)">Clear</button>
                </div>
            </OuiDialog>

        </template>
    </OuiPage>
</template>
