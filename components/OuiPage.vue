<script setup lang="ts">

defineProps<{ title?: string }>()

const headerSticky = ref(false)
const viewingEl = ref<HTMLElement>()
let obs: IntersectionObserver

onMounted(() => {
    handleSliverScroll()
})
onUnmounted(() => {
    if (viewingEl.value)
        obs.unobserve(viewingEl.value)
})

function handleSliverScroll() {
    if (!viewingEl.value) return

    obs = new IntersectionObserver((els) => {
        const t = els[0]

        if (t.isIntersecting) {
            headerSticky.value = false
        } else
            headerSticky.value = true
    }, { threshold: [0, .2, .4, .6, .8, 1] })

    obs.observe(viewingEl.value)
}

</script>

<template>
    <main class="oui-page__container">
        <div class="oui-viewing" ref="viewingEl">
            <h1 class="oui-viewing-title">
                <slot name="viewing" />
            </h1>
        </div>
        <div class="oui-header" :class="{ 'sticky': headerSticky }">
            <slot name="header" />
            <Transition name="pop">
                <h2 v-show="headerSticky">{{ title }}</h2>
            </Transition>
        </div>
        <div class="oui-interaction">
            <slot name="interaction" />
        </div>
        <div class="oui-sticky-bottom">
            <slot name="sticky-bottom" />
        </div>
    </main>
</template>

<style>
.oui-viewing {
    height: var(--oui-viewing--height) !important;
}


.hide-viewing>.oui-viewing {
    display: none;
}

.oui-header.sticky {
    position: fixed;
    top: 0;
}

.oui-header {
    position: absolute;
    max-height: var(--oui-header--height) !important;
    width: 100%;
    background: var(--background);
    z-index: 1;
    display: flex;
    align-items: center;
}

.sticky-header .oui-header {
    position: absolute;
    border-bottom: 1px solid var(--d-grey);
    box-shadow: 0 4px 0 #ffffff50
        /* var(--surface-background) */
    ;
    max-height: none !important;
    min-height: 3rem;
}

.oui-sticky-bottom {
    position: fixed;
    bottom: 0;
    height: fit-content;
    width: 100%;
    background-color: var(--background);
}

.oui-page__container {
    position: relative;
    --oui-viewing--height: 40%;
    --oui-header--height: min(5rem, 15%);
    overflow-y: scroll;
    height: 100vh;
}

.oui-interaction {
    overflow-y: scroll;
    min-height: calc(93vh - var(--oui-header--height)) !important;
    flex: 1;
    /* scroll-padding-bottom: -25rem; */
    margin-top: var(--oui-header--height);
    padding-bottom: 5rem;
}

.full-interaction>.oui-interaction {
    min-height: 100vh;
}
</style>
