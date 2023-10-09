<template>
    <div class="oui-toast py-1 p-2" v-show="store.message.show">
        <Icon :name="store.message.icon||'note'" class="smaller grey full m-0" />
        <span class="oui-toast-text p-1">{{ store.message.desc }}</span>
    </div>
</template>

<script setup>
const store = useStore()
</script>
