<template>
    <div class="oui-menu">
        <anchor class="oui-menu-trigger">
            <slot name="summary"><button class="oui-button">Menu</button></slot>
        </anchor>

        <div class="oui-menu-expand">
            <slot>
            </slot>
        </div>
    </div>
</template>

<style>
.oui-menu>.oui-menu-expand {
    display: none;
    position: absolute;
    padding-top: 2rem;
    top: 20%;
    right: 2px;
    text-align: left;
    width: clamp(150px, 70vw, 20rem);
    transition: all var(--transition-slow);
    z-index: 5;
}

.oui-menu.fit-content>.oui-menu-expand {
    width: fit-content;
}

.oui-menu-trigger {
    list-style: none;
}

.oui-menu.show>.oui-menu-expand,
.oui-menu-trigger:active~.oui-menu-expand,
.oui-menu-expand:is(:focus-within, :active, :hover) {
    display: block;
}

.oui-menu-trigger::marker,
.oui-menu-trigger::-webkit-details-marker {
    display: none;
}

.oui-overlay-bubble-item {
    padding: 0;
}

.oui-overlay-bubble-item.selected {
    color: var(--accent-badge);
}
</style>
