<template>
    <div class="menu-items d-flex justify-content-around">
        <slot />
    </div>
</template>

<style>
.menu-items>* {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
