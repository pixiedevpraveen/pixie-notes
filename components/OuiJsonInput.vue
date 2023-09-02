<template>
    <!-- <div>
        <oui-input v-if="(value.__type || typeof (value?.value || )) === 'string'" type="text" :value="v" :id="k" :label="k"
            @update:value="(n: string) => { if (Object.hasOwn(value, k)) (value[k] as string) = n }"></oui-input>
        <oui-switch v-else-if="typeof v === 'boolean'" :checked="v" :id="k" :label="k"
            @update:checked="(v: boolean) => (value[k] as unknown as boolean) = v"></oui-switch>
    </div> -->
    <!-- <span v-else>{{ value }}</span> -->
    <span>{{ getType() }}</span>
    <!-- <oui-switch v-else-if="typeof v === 'boolean'" :checked="v" :id="k" :label="k"
        @update:checked="(v: boolean) => (value[k] as unknown as boolean) = v"></oui-switch>
    <oui-input v-else="typeof v === 'string'" type="text" :value="v" :id="name" :label="name"
        @update:value="(n: string) => { if (Object.hasOwn(value, name)) (value[name] as string) = n }"></oui-input> -->
</template>

<script setup lang="ts">
type Value = string | number | boolean | any[] | { __type?: string, value: Value };
const { value } = defineProps<{ name?: string, value: Value, type: string }>()

function getType()/* : "string" | "boolean" | "number" | "object" */ {
    let type
    if (typeof value !== "object")
        type = typeof value
    else if (Array.isArray(value)) {
        if (value.length) {
            type = (typeof value[0]) + "[]"
        } else type = "[]"
    }
    // value.__type
    return type
}
</script>
