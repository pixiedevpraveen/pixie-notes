<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
    title: "Home"
})
const routes = [["Notes", "/notes", "file-text"], ["Settings", "/settings", "settings"]]

</script>

<template>
    <OuiPage :title="config.public.appName">
        <template #viewing>
            {{ config.public.appName }}
        </template>

        <template #header>
            <div class="d-flex text-center align-items-center scroll-y-auto">
                <Icon name="menu" class="medium pointer mx-3" @click="useMutation().openDrawer()" />
            </div>
        </template>

        <template #interaction>
            <div class="oui-drawer__items gap-3">
                <NuxtLink v-for="route in routes" :key="route[1]" :to="route[1]" class="oui-drawer__item route shadowed p-3"
                    data-toggle>
                    <icon :name="route[2] || 'folder'" class="no-active-bg mx-2" data-toggle /> {{ route[0] }}
                </NuxtLink>
            </div>
        </template>
    </OuiPage>
</template>
