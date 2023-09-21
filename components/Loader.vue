<template>
    <div class="oui-dialog-mask">
        <div class="loaders">
            <span class="loader"></span>
        </div>
    </div>
</template>
<style scoped>
.loaders {
    --size: 2rem;
    --size-loader: calc(var(--size) * .4);
    --size-animation: calc(var(--size) * .6);
    --size-position: calc(50% - var(--size) * .5);
    --size-transform: calc(var(--size) * .3);
    --size-margin: calc(var(--size) * .2);
    user-select: none;
    pointer-events: none;
    z-index: 1001;
    height: var(--size);
    width: var(--size);

    position: fixed;
    left: var(--size-position);
    top: var(--size-position);
    animation: rotate 1s infinite;
}

.loader:before,
.loader:after {
    border-radius: 50%;
    content: "";
    display: block;
    height: var(--size-loader);
    width: var(--size-loader);
}

.loader:before {
    animation: ball1 1s infinite;
    background-color: var(--primary);
    box-shadow: var(--size-animation) 0 0 var(--secondary);
    margin-bottom: var(--size-margin);
}

.loader:after {
    animation: ball2 1s infinite;
    background-color: var(--primary);
    box-shadow: var(--size-animation) 0 0 var(--primary);
}

@keyframes rotate {
    0% {
        transform: rotate(0deg) scale(0.8)
    }

    50% {
        transform: rotate(360deg) scale(1.2)
    }

    100% {
        transform: rotate(720deg) scale(0.8)
    }
}

@keyframes ball1 {
    0% {
        box-shadow: var(--size-animation) 0 0 var(--secondary);
    }

    50% {
        box-shadow: 0 0 0 var(--secondary);
        margin-bottom: 0;
        transform: translate(var(--size-transform), var(--size-transform));
    }

    100% {
        box-shadow: var(--size-animation) 0 0 var(--secondary);
        margin-bottom: var(--size-margin);
    }
}

@keyframes ball2 {
    0% {
        box-shadow: var(--size-animation) 0 0 var(--primary);
    }

    50% {
        box-shadow: 0 0 0 var(--primary);
        margin-top: calc(var(--size-margin) * -2);
        transform: translate(var(--size-transform), var(--size-transform));
    }

    100% {
        box-shadow: var(--size-animation) 0 0 var(--primary);
        margin-top: 0;
    }
}
</style>