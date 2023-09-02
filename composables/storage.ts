import { Preferences } from '@capacitor/preferences';

// type 

export const useLocalStore = () => ({
    async setItem(key: string, value: any) {
        await Preferences.set({
            key,
            value: typeof value === "string" ? value : JSON.stringify(value)
        });
    },
    async getItem<T>(key: string, parse = true) {
        const ret = await Preferences.get({ key });

        try {
            if (parse)
                return JSON.parse(ret.value as string) as T
        } catch (er) {
        }
        return ret.value as T
    },
    _el: Preferences
})

export function usePersistRef<T>(key: string, value?: T)/* : [() => T | undefined, (v: T) => void] */ {
    let timeoutId: ReturnType<typeof setTimeout>
    const lstore = useLocalStore()

    return customRef((track, trigger) => {
        setTimeout(async () => {
            if (value) {
                await lstore.setItem(key, value)
            } else {
                const v = await lstore.getItem<T>(key)
                if (v) {
                    value = v
                    trigger()
                }
            }
        });
        return {
            get() {
                track()
                return value
            },
            set(newValue) {
                value = newValue
                trigger()
                clearTimeout(timeoutId)
                timeoutId = setTimeout(async () => {
                    await lstore.setItem(key, newValue)
                }, 500)
            }
        }
    })
}
