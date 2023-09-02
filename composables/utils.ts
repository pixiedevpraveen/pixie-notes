export const makeSecret = (msg: string, low: false) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(msg)
    return crypto.subtle.digest(low ? "SHA-1" : "SHA-256", data)
}
export function strSlice(str: string, end: number, placeholder = '...') {
    return str.length < end ? str : str.slice(0, end) + placeholder
}
export function emailHide(email: string, placeholder = '***') {
    return email.replace(/(\w{2})[\w.-]+@([\w.]+\w)/, `$1${placeholder}@$2`)
}
export function strCamelSplit(str: string) {
    return str.replace(/([a-z](?=[A-Z]))/g, '$1 ')
}
