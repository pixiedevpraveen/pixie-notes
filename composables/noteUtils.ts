import { Note } from "@/models/note"

export const updatableFields = new Set<keyof Note>(["title", "is_locked", "is_favourite", "created", "color", "folder", "is_active", "is_md", "keywords"])

export function getNewNote() {
    const t = new Date()

    const note: Note = {
        color: "",
        created: t.toISOString(),
        updated: t.toISOString(),
        folder: "",
        id: "new-" + crypto.randomUUID(),
        is_active: true,
        is_favourite: false,
        is_locked: false,
        is_md: false,
        keywords: "",
        title: "",
        user: "",
    }
    return note
}
