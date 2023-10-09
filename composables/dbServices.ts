import { Note, Content } from "@/models/note";
import { Models } from "./orm";
import { BaseSearchActionsInterface, BaseWriteActionsInterface } from "indexeddb-orm/dist/models/model.interface";

export class NotesService {

    static async getModels() {
        const orm = useOrm("pixie")
        return await orm.connect<Models>()
    }

    static async getNoteById(noteId: Note['id']) {
        const models = await this.getModels()
        return await models.notes.find<Note>(noteId)
    }

    static async getNoteContentById(noteId: Note['id']) {
        const models = await this.getModels()
        return await models.contents.find<Content>(noteId)
    }

    static async createNote(note: Note) {
        const models = await this.getModels()
        const { content, ...data } = note
        const res = await Promise.all([
            models.notes.create<Note>(data),
            models.contents.create<Content>({ content, id: note.id, table: "notes", updated: note.updated })
        ])
        if (res)
            this.createSyncRecord(models, note.id as string, "create")
        return res
    }

    static async saveNote(note: Note | Record<keyof Note, unknown>, deepMerge = true) {
        const models = await this.getModels()
        const { content, ...data } = note

        if (data.title) {
            data.updated = new Date().toISOString()
        }

        const res = await models.notes.save(note.id, data, deepMerge)

        const updatedKeys = Object.keys(note)

        if (res)
            this.createSyncRecord(models, note.id as string, "update", updatedKeys)
        return res
    }

    static async saveNoteFields(note: Note, fields: Set<keyof Note> | (keyof Note)[]) {
        const data: Record<string, unknown> = {}
        data.id = note.id
        fields.forEach(key => {
            data[key] = note[key]
        })
        return await this.saveNote(data, true)
    }

    static async saveNotesFieldByIds(ids: Note['id'][], field: keyof Note, value: unknown, ifValue?: unknown) {
        const models = await this.getModels()
        const data: Record<string, unknown> = {}
        if (field === "title" || field === "content")
            data.updated = new Date().toISOString()
        data[field] = value
        let query: any = models.notes.whereIndexIn("id", ids)
        if (ifValue) query = (query.where(field, ifValue) as BaseWriteActionsInterface)
        const res = await (query as BaseWriteActionsInterface).update(data, true)

        // TODO: handle multiple ids
        if (res) this.createSyncRecord(models, ids.join(','), "update", [field])
        return res
    }

    static async saveNoteContent(id: Note['id'], content: string, deepMerge = true) {
        const models = await this.getModels()
        const updated = new Date().toISOString()

        const res = await models.contents.save(id, { content, id, table: "notes", updated: updated }, deepMerge)
        if (res) {
            this.createSyncRecord(models, id, "update", ["content"])
            this.saveNote({ id, updated } as Note)
        }
        return res
    }

    private static async createSyncRecord(models: Awaited<ReturnType<typeof this.getModels>>, tableId: Note['id'], action: "create" | "update" | "delete", fields: string[] = []) {
        setTimeout(async () => {

            const data: Record<string, unknown> = { tableId, action, table: "notes" }
            fields.forEach(f => data[f] = 1)
            delete data.id

            switch (action) {
                case "update":
                    data.updated = new Date().getTime()
                    const record = await (models.sync.whereIndex("id-action", [tableId, action]) as BaseWriteActionsInterface).update(data, true)

                    if (record)
                        break;

                case "create":
                case "delete":
                    await models.sync.create(data)
                    break;
            }
        }, 10);
    }

    static async getActiveNotesListWhere(attr?: keyof Note, value?: unknown) {
        const models = await this.getModels()
        let query: BaseSearchActionsInterface = (models.notes.where("is_active", true) as any)
        if (attr && value)
            query = (models.notes.where(attr, value) as BaseSearchActionsInterface)
        return await query.all<Note>()
    }

    static async getInactiveNotesList() {
        const models = await this.getModels()
        return await (models.notes.where("is_active", false) as BaseSearchActionsInterface).all<Note>()
    }

    static async getActiveNotesList() {
        return await this.getActiveNotesListWhere()
    }

    static async getNotesList() {
        const models = await this.getModels()
        return await models.notes.all<Note>()
    }
}
