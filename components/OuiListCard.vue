<template>
    <div class="oui-list-card d-flex justify-content-between align-items-center gap-2 py-4 px-4 rounded-3">
        <Icon v-if="icon" :name="icon" :alt="alt" class="medium" />
        <div class="row gap-1">
            <strong class="font-bold font-2x">{{ title }}</strong>
            <div>
                <span class="dot-join" v-for="t in text" :key="t">{{ t }}</span>
            </div>
        </div>
        <img v-if="img" :src="img" :alt="alt" class="shadowed" />
    </div>
</template>

<script setup lang="ts">
defineProps<{ title: string, img?: string, alt?: string, icon?: string, text: string[] }>()
</script>

<style>
.oui-list-card {
    background-color: var(--surface-background);
    height: 3.5rem;
}

.oui-list-card img {
    width: clamp(2rem, 3.5rem, 15%);
    border-radius: 50%;
}
</style>
