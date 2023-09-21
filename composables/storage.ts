import { Preferences } from '@capacitor/preferences';

// type 

export const useLocalStore = () => ({
    async setItem(key: string, value: any) {
        await Preferences.set({
            key,
            value: PrJson.stringify(value)
        });
    },
    async removetItem(key: string) {
        await Preferences.remove({ key });
    },
    async getItem<T>(key: string, parse = true) {
        const ret = await Preferences.get({ key });

        try {
            if (parse)
                return PrJson.parse<T>(ret.value as string)
        } catch (er) {
        }
        return ret.value as T
    },
    _el: Preferences
})

const PrJson = {
    stringify(value: any) {
        return typeof value === "string" ? value : JSON.stringify(value,
            function replacer(key, value) {
                if (value instanceof Map) {
                    return { __type: 'Map', value: Object.fromEntries(value) }
                }
                if (value instanceof Set) {
                    return { __type: 'Set', value: Array.from(value) }
                }
                return value
            }
        )
    },
    parse<T = any>(value: string) {
        return JSON.parse(value as string,

            function reviver(key, value) {
                if (value?.__type === 'Set') {
                    return new Set(value.value)
                }
                if (value?.__type === 'Map') {
                    return new Map(Object.entries(value.value))
                }
                return value
            }
        ) as T
    }
}