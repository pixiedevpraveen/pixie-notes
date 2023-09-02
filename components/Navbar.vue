<template>
    <nav class="oui-tab">
        <a v-for="(tabbtn, index) in tabs" :key="tabbtn" @click="navTab = index" href="#"
            class="oui-tab-link" :class="{ 'oui-tab-link--active': navTab == index }">{{ tabbtn }}</a>
            <!-- <Navbar :tabs="['Conversations', 'Contacts', 'Useful Cards']" /> -->
    </nav>
</template>

<script setup lang="ts">
// const store = useStore()
const { tabs } = defineProps<{ tabs: string[] }>()
const navTab = ref(0)
</script>

<style scoped></style>
