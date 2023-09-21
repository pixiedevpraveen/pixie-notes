import { Note } from "@/models/note"

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

export const useNotes = () => useState<Map<string, Note>>('notes', () => (new Map()))

export const useSetting = () => useState('settings', () => ({
    appName: {
        value: "Pixie", readonly: true
    },
    syncNotes: {
        value: true, readonly: false
    },
    noteUnlockMethods: {
        value: {
            password: {
                value: "",
                type: "password"
            },
            biometrics: {
                value: false,
                type: "biometrics"
            },
            type: "category"
        },
        enabled: false,
        type: "category"
    },
    homeRoutes: {
        value: [{ name: "notes", path: "/notes", icon: "file-text" }, { name: "settings", path: "/settings", icon: "settings" }],
        view: { selected: "list", options: ["list", "grid"] },
        type: "routes"
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
