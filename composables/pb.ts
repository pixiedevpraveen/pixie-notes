import { NetworkError } from '@/models/errors';
import { User } from '@/models/user';
import PocketBase from 'pocketbase';
import { Preferences } from '@capacitor/preferences';

export const usePbAuth = () => ({
    async login(email?: string, password?: string) {
        const pb = usePocketbase()

        try {
            if (email && password) {
                await pb.collection("users").authWithPassword(email, password)
                const token = pb.authStore.exportToCookie()

                this.updateAuthUser()
                await Preferences.set({ key: 'token', value: token })
                return true
            }
            
            const token = await Preferences.get({ key: 'token' })
            if (token.value) {
                pb.authStore.loadFromCookie(token.value)
                this.updateAuthUser()
                return true
            }
        } catch (er) {
        }
        return false
    },
    updateAuthUser() {
        const pb = usePocketbase()

        const authUser = useAuthUser()
        authUser.value = pb.authStore.model as User
    }
})

export const usePocketbase = () => {
    var pb
    try {
        if (!pb) {
            pb = new PocketBase(useRuntimeConfig().public.apiBase);
        }
        return pb
    } catch (er) {
        throw new NetworkError()
    }
}
