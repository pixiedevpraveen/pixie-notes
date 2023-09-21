export const makeSecret = async (msg: string, high: boolean = false) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(msg)
    return await crypto.subtle.digest(high ? "SHA-256" : "SHA-1", data)
}

export function strSlice(str: string, end: number, placeholder = '...') {
    return str?.length < end ? str : str?.slice(0, end) + placeholder
}
export function emailHide(email: string, placeholder = '***') {
    return email.replace(/(\w{2})[\w.-]+@([\w.]+\w)/, `$1${placeholder}@$2`)
}
export function strCamelSplit(str: string) {
    return str.replace(/([a-z](?=[A-Z]))/g, '$1 ')
}
export function toggleFullscreen(el?: Element) {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        if (el) el.requestFullscreen ? el.requestFullscreen() : el.webkitRequestFullScreen()
    }
}

export function getTime(str: string) {
    try {
        const t = new Date(str)
        return t.toLocaleDateString("en-IN", {
            year: "numeric",
            day: "numeric",
            month: "short",
        }) + " at " +
            t.toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric" })
    }
    catch { return str }
}

export function getDateOrTime(str: string) {
    try {
        const t = new Date(str)
        const ct = new Date()
        if (t.getDate() === ct.getDate() && t.getMonth() === ct.getMonth() && t.getFullYear() === ct.getFullYear()) {
            return t.toLocaleTimeString("en-IN", { hour: "numeric", minute: "numeric" })
        } else {
            const opts: Record<string, string> = {
                day: "numeric",
                month: "short"
            }
            if (t.getFullYear() !== ct.getFullYear())
                opts["year"] = "numeric"
            return t.toLocaleDateString("en-IN", opts)
        }
    }
    catch { return str }
}
