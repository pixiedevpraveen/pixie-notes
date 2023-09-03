import { User } from "@/models/user"

export const useStore = () => useState('store', () => ({
    dev: process.dev,
    showNavbar: false,
    loading: false,
    message: {
        show: false, desc: "Welcome",
    },
    drawer: false,
    dialog: new Array<string>(),
    updatedAt: new Date()
}))

export const activities = {
    background: new Map<string, { action: Function }>(),
    onBack: new Map<string, { type: string, once: boolean, action: Function }>(),
}

export const useSetting = () => useState('settings', () => ({
    authentication: { value: defaultAuth(), hidden: true },
    user: { value: defaultUser(), hidden: true },
    syncNotes: {
        value: true
    },
    appName: {
        value: "Pixie", readonly: true
    },
    autoSaveNotes: {
        value: true
    },
    _errorMsg: {
        value: false
    }
}))

let msgTimeoutId: ReturnType<typeof setTimeout>

export const useMutation = () => ({
    store: useStore(),
    setMsg(msg: string, timeout: number = 5000) {
        this.store.value.message.desc = msg
        if (!this.store.value.message.show)
            this.store.value.message.show = true

        clearTimeout(msgTimeoutId)
        msgTimeoutId = setTimeout(() => {
            this.store.value.message.show = false
        }, timeout);
    },
    closeDialog(name?: string, all = false) {
        let last = this.store.value.dialog.at(-1)
        if (name) {
            this.store.value.dialog = this.store.value.dialog.filter(n => n !== name)
        }
        else if (all) {
            this.store.value.dialog = []
        } else {
            this.store.value.dialog.pop()
        }
        return last
    },
    closeDrawer() {
        if (this.store.value.drawer) {
            this.store.value.drawer = false
            return true
        }
    },
    openDrawer() {
        if (!this.store.value.drawer) {
            this.store.value.drawer = true
        }
    },
    openDialog(name: string) {
        this.store.value.dialog.push(name)
    }
})


export function defaultUser(): User {
    return {
        id: '',
        verified: false,
        name: '',
        username: '',
        email: '',
        emailVisibility: false,
        is_admin: false,
        avatar: '',
        data: {},
        created: '',
        updated: ''
    }
}

export function defaultAuth() {
    return {
        email: "",
        password: "",
        token: ""
    }
}
