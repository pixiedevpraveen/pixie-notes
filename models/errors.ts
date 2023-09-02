export class ValueTypeError extends Error {
    constructor(msg?: string, { cause }: { cause?: any } = {}) {
        super(msg || "Unknown value type!", { cause })
        this.name = "ValueError"
    }
}

export class NetworkError extends Error {
    constructor(msg?: string, { cause }: { cause?: any } = {}) {
        super(msg || "You are offline.", { cause })
        this.name = "NetworkError"
    }
}
