<script setup lang="ts">

useHead({
    title: "About Us"
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
                    <icon name="previous" title="Back" class="pointer" @click="$router.back()" />
                </div>
            </template>
            <template #interaction>
                <div class="mt-2">
                    Application: Pixie
                    Version: 0.1.5
                    Author: <a href="https://github.com/pixiedevpraveen" target="_blank">Praveen Yadav</a>
                </div>
            </template>
        </OuiPage>
    </div>
</template>
