<script setup lang="ts">
import { App as CapApp } from "@capacitor/app";

useHead({
    title: "About Us"
})

const config = useRuntimeConfig()

const appInfo = ref({
    name: config.public.appName,
    id: "",
    build: "",
    version: config.public.appVersion
})

onMounted(async () => {
    try {
        appInfo.value = await CapApp.getInfo()
    } catch (er) {
    }
})

</script>

<template>
    <div class="page">
        <OuiPage title="About Us">
            <template #viewing>
                About Us
            </template>
            <template #header>
                <div class="d-flex text-center align-items-center">
                    <backIconButton class="m-2 mx-3" />
                </div>
            </template>
            <template #interaction>
                <div class="d-flex flex-column align-items-center mt-2">
                    <h1>{{ appInfo?.name }}</h1>
                    <span>Version {{ appInfo?.version }}</span>
                    <span>Author: <a href="https://github.com/pixiedevpraveen" target="_blank">Praveen Yadav</a></span>
                </div>
            </template>
        </OuiPage>
    </div>
</template>
