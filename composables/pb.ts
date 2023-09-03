import { NetworkError } from '@/models/errors';
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
