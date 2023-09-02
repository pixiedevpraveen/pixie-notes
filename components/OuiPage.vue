<script setup lang="ts">
const interaction = ref<HTMLElement>()
const stickyTop = ref<HTMLElement>()
</script>

<template>
    <main class="oui-page__container">
        <div class="oui-viewing">
            <slot name="viewing" />
        </div>
        <div class="oui-sticky-top" ref="stickyTop">
            <slot name="sticky-top" />
        </div>
        <div class="oui-interaction" ref="interaction">
            <slot name="interaction" />
        </div>
        <div class="oui-sticky-bottom">
            <slot name="sticky-bottom" />
        </div>
    </main>
</template>

<style scoped>
.oui-viewing {
    height: var(--oui-viewing--height) !important;
}

.hide-viewing>.oui-viewing {
    display: none;
}

.oui-sticky-top {
    max-height: var(--oui-sticky-top--height) !important;
    top: 0;
    width: 100%;
}

.sticky-top .oui-sticky-top {
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
    --oui-viewing--height: 40%;
    --oui-sticky-top--height: min(5rem, 12%);
    overflow: scroll;
    height: 100vh;
}

.oui-interaction {
    overflow-y: scroll;
    height: calc(93vh - var(--oui-sticky-top--height));
    flex: 1;
    /* scroll-padding-bottom: -25rem; */
    padding-bottom: 5rem;
}

.full-interaction>.oui-interaction {
    min-height: 100vh;
}</style>
