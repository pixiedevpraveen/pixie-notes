<template>
  <Head>
    <Meta name="color-scheme" content="light dark" />
  </Head>
  <OuiDrawer />
  <NuxtPage />
  <OuiToast />
</template>

<script setup>
import { App as CapApp } from "@capacitor/app";
import { activities, useMutation, useSetting } from "@/composables/store";
import { usePbAuth } from "@/composables/pb";
const config = useRuntimeConfig()
const pbAuth = usePbAuth()

useHead({
  titleTemplate: (title) => title ? (title + " | " + config.public.appName) : config.public.appName
})

const mutation = useMutation()
const setting = useSetting()
const localStore = useLocalStore()
let confirmed = false

const selected = useState('selected')

onMounted(async () => {

  const initDone = await localStore.getItem('initDone')
  if (!initDone) {
    // Request persistent storage for site
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      if (!isPersisted)
        mutation.setMsg("Persisted storage not granted!");
    }
    setTimeout(async () => {
      await localStore.setItem('initDone', true)
    }, 1000);
  } else {
    pbAuth.login()
    const sd = await localStore.getItem('setting')
    if (sd) {
      Object.entries(setting.value).forEach(([k, v]) => {
        if (sd[k] === undefined) sd[k] = v
      })
      setting.value = sd
    }
  }
  handleBack()
})

async function handleBack() {
  await CapApp.addListener('backButton', ({ canGoBack }) => {

    /* If Drawer or any dialog opened it will close it one by one on each back button click */
    if (mutation.closeDrawer() || mutation.closeDialog()) return

    if (selected.value?.size > 0) { selected.value.clear(); return }

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
        CapApp.exitApp();
      } else {
        // handle background process
        mutation.setMsg("Press back again to exit.")
        confirmed = true
        setTimeout(() => {
          confirmed = false
        }, 5000);
      }
    } else if (!canGoBack) {
      navigateTo('/', { replace: true });
    } else {
      useRouter().back();
    }
  })
}

</script>

<style>
@import "@/assets/oneui/themes/oui-dark-theme.css" screen and (prefers-color-scheme: dark);

@media screen and (prefers-color-scheme: dark) {

  [class^='icon-']:not(.colored, .grey):not(:active) {
    -webkit-filter: invert(100%);
    -ms-filter: invert(100%);
    filter: invert(100%);
  }
}
</style>
