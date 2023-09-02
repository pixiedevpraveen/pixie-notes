<template>
    <Transition name="opacity">
        <div class="oui-dialog-mask" v-if="store.drawer"></div>
    </Transition>
    <div class="oui-drawer" :class="{ 'show': store.drawer }" @click="toggle" data-toggle>
        <div class="oui-drawer__body" v-bind="$attrs">
            <div class="oui-drawer__header justify-content-end p-3" data-toggle>
                <Icon name="settings" class="pointer grey route" @click="navigateTo('/settings')" data-toggle></Icon>
            </div>
            <div class="oui-drawer__items">
                <NuxtLink v-for="route in routes" :key="route[1]" :to="route[1]" class="oui-drawer__item route" data-toggle>
                    <icon :name="route[2] || 'folder'" class="no-active-bg mx-2" data-toggle /> {{ route[0] }}
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
const store = useStore()
const routes = [["Home", "/", "home"], ["Notes", "/notes", "file-text"]/* , ["Pages", "/pages", "file-text"] *//* , ["Dev", "/dev", "alert-triangle"] */]

function toggle(e) {
    if (e.target.dataset.toggle !== undefined) store.value.drawer = !store.value.drawer
}
// onMounted(() => {
//     handleSwipe()
// })

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
.oui-drawer {
    position: absolute;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    padding-top: 1px;
    padding-bottom: 1px;
    z-index: 2001;
    transform: translateX(-99%);
    transition: var(--transition-fast);
}

.oui-drawer~.page {
    transition: var(--transition-fast);
    overflow-y: hidden;
}

.oui-drawer.show~.page {
    transform: translateX(80vw);
}

.oui-drawer.show {
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
    font-weight: bolder;
    background: #97979750;
    border-color: var(--active);
}
</style>
