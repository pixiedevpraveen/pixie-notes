import { NetworkError } from '@/models/errors';
import { User } from '@/models/user';
import PocketBase from 'pocketbase';

export const auth = {
    async login() {
        const pb = usePocketbase()
        const setting = useSetting()
        const mutation = useMutation()

        try {
            const conf = setting.value.authentication.value
            if (conf.token) {
                pb.authStore.loadFromCookie(conf.token)
                return true
            } else if (conf.email && conf.password) {
                await pb.admins.authWithPassword(conf.email, conf.password)
                conf.token = pb.authStore.exportToCookie()
                return true
            }
        } catch (er) {
            if (setting.value._errorMsg.value)
                mutation.setMsg("Unable to login! check your internet.")
        }
        return false
    },
    async setUser() {
        const pb = usePocketbase()
        const setting = useSetting()

        try {
            const user = await pb.collection("users").getFirstListItem<User>(`email = '${setting.value.authentication.value.email}'`)
            setting.value.user.value = user
            return true
        } catch (er) {
        }
        return false
    }
}

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
