<script setup lang="ts">
const config = useRuntimeConfig()
const setting = useSetting()

useHead({
    title: "Home"
})

</script>

<template>
    <div class="page">
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
                    <NuxtLink v-for="route in setting.homeRoutes.value" :key="route.path" :to="route.path"
                        class="oui-drawer__item route shadowed p-3" data-toggle>
                        <icon :name="route.icon || 'folder'" class="no-active-bg mx-2" data-toggle /> {{ route.name }}
                    </NuxtLink>
                </div>
            </template>
        </OuiPage>
    </div>
</template>
