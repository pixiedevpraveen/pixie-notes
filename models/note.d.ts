
export type NoteListItem = {
    title: string
    id: string
    is_locked: boolean
    is_favourite: boolean
    created: string
    updated: string
    color: string
}

export type Note = NoteListItem & {
    folder: string
    user: UserListItem
    is_active: boolean
    is_md: boolean
    tags: string
    content: string
}
