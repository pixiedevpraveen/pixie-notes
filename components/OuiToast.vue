<template>
    <div class="oui-toast">
        <span class="oui-toast-text" v-if="store.message.show">{{ store.message.desc }}</span>
    </div>
</template>

<script setup>
const store = useStore()
</script>
