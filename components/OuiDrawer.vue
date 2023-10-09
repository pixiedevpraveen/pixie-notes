<template>
    <Transition name="opacity">
        <div class="oui-dialog-mask" v-show="store.drawer"></div>
    </Transition>
    <div class="oui-drawer" @click="toggle" data-toggle>
        <Html :class="{drawer: store.drawer}"></Html>
        <div class="oui-drawer__body" v-bind="$attrs">
            <div class="oui-drawer__header justify-content-end p-3" data-toggle>
                <Icon name="settings" class="pointer grey route" @click="navigateTo('/settings')" data-toggle></Icon>
            </div>
            <div class="oui-drawer__items gap-1">
                <NuxtLink v-for="route in routes" :key="route[1]" :to="route[1]" class="oui-drawer__item route" data-toggle>
                    <icon :name="route[2] || 'folder'" class="no-active-bg mx-2" data-toggle /> {{ route[0] }}
                </NuxtLink>
            </div>
            <div id="drawer-teleport">
            </div>
        </div>
    </div>
</template>

<script setup>
const store = useStore()
const routes = [["All Notes", "/", "note"], ['Favourite notes', '/fav-notes', 'star'], ['Locked notes', '/locked-notes', 'lock'], ["About", "/about", "info"]]

function toggle(e) {
    if (e.target.dataset.toggle !== undefined) store.value.drawer = !store.value.drawer
}

let touchstarX = 0
let touchendX = 0
function handleSwipe() {
    document.querySelector(".oui-drawer").addEventListener("touchstart", (e) => {
        touchstarX = e.changedTouches[0].screenX
    })
    document.querySelector(".oui-drawer").addEventListener("touchend", (e) => {
        touchendX = e.changedTouches[0].screenX
        if (touchendX < touchstarX && Math.abs(touchendX - touchstarX) > 20) {
            store.value.drawer = false
        }
        if (touchendX > touchstarX && Math.abs(touchendX - touchstarX) > 20) {
            store.value.drawer = true
        }
    })
}

</script>

<style>
html.drawer {
    overflow: hidden !important;
}

.oui-drawer {
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0;
    padding: 1px 0;
    z-index: 2001;
    transform: translateX(-99%);
    transition: var(--transition-fast);
}

.oui-drawer~.page {
    transition: transform var(--transition-fast);
}

html.drawer .oui-drawer {
    transform: none;
}
html.drawer .oui-drawer {
    transform: none;
}

.oui-drawer__header {
    min-height: 3rem;
    display: flex;
}

.oui-drawer__body {
    background-color: var(--surface-background);
    border-radius: 0 calc(var(--border-radius) * 1.5) calc(var(--border-radius) * 1.5) 0;
    height: calc(100% - 2px);
    width: 80vw;
    border: 1px solid var(--border-surface);
    box-shadow: 0px 2px 3px 0px var(--border-surface);
}

.oui-drawer__items {
    padding: 0 5px;
    display: flex;
    flex-direction: column;
}

.oui-drawer__item {
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 1rem;
    border-radius: calc(var(--border-radius) * .8);
}

.oui-drawer__item:is(:active, .router-link-active, :focus) {
    outline: transparent;
    background: var(--m-grey-low);
    border-color: var(--active);
}

.oui-drawer__item.router-link-active {
    font-weight: bolder;
}

</style>
