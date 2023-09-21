<template>
    <button type="button" class="oui-button-floating">
        <slot />
    </button>
</template>

<style>
.oui-button-floating {
    position: fixed;
    border: none;
    background-color: var(--textual-background);
}

.oui-button-floating.button-bottom-right {
    bottom: 2rem;
    right: 2rem;
}

.oui-button-floating.button-top-right {
    top: 2rem;
    right: 2rem;
}
</style>
