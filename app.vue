<template>
  <Head>
    <Meta name="color-scheme" content="light dark" />
  </Head>
  <OuiDrawer />
  <NuxtPage />
  <OuiToast />
</template>

<script setup>
import { App as CapacitorApp } from "@capacitor/app";
import { activities, useMutation, useSetting } from "@/composables/store";
import { auth } from "./composables/pb";
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) => title ? (title + " | " + config.public.appName) : config.public.appName
})

const mutation = useMutation()
const setting = useSetting()
const localStore = useLocalStore()
let confirmed = false

onMounted(async () => {
  const initDone = await localStore.getItem('initDone')
  if (!initDone) {
    setTimeout(async () => {
      await localStore.setItem('initDone', true)
    }, 1000);
  } else {
    const sd = await localStore.getItem('setting')
    if (sd) {
      Object.entries(setting.value).forEach(([k, v]) => {
        if (sd[k] === undefined) sd[k] = v
      })
      setting.value = sd
    }
    auth.login()
  }
  handleBack()
})

async function handleBack() {
  await CapacitorApp.addListener('backButton', ({ canGoBack }) => {

    /* If Drawer or any dialog opened it will close it one by one on each back button click */
    if (mutation.closeDrawer() || mutation.closeDialog()) return

    /* perform onBack activities one by one on each back button click */
    for (const [key, act] of activities.onBack.entries()) {
      act.action()
      activities.onBack.delete(key)
      if (act.once) {
        return
      }
    }

    if (useRoute().fullPath === '/') {
      if (confirmed) {
        confirmed = true
        CapacitorApp.exitApp();
      } else {
        // handle background process
        mutation.setMsg("Press back again to exit.")
        confirmed = true
        setTimeout(() => {
          confirmed = false
        }, 5000);
      }
    } else {
      useRouter().back();
    }
  })
}

</script>
