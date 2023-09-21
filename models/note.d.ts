export type Content = {
    id: string
    content: string
    updated: string
}

export type Note = {
    title: string
    id: string
    is_locked: boolean
    is_favourite: boolean
    is_active: boolean
    created: string
    updated: string
    color: string
    folder: string
    user: string
    is_md: boolean
    keywords: string
    content?: string
}
