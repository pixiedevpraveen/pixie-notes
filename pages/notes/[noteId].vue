<script setup lang="ts">
import { Note } from '@/models/note';
import { getNewNote } from '@/composables/noteUtils';
import { NotesService } from '@/composables/dbServices';

const mutation = useMutation()
const route = useRoute()
const updatedFields = new Set<keyof Note>()

const noteId = route.params.noteId
const KEY = 'note.' + noteId
const noteData = useState<Note>(KEY)
const updatedNoteId = useState("updatedNoteId")
const content = ref('')
const status = ref<'pending' | 'done' | 'error'>('pending')

let isNew = false

onMounted(async () => {
    if (route.query.create === "true") {
        isNew = true
        noteData.value = getNewNote()
        navigateTo({ query: { noteId: noteData.value.id, mode: 'edit' } }, { replace: true })
    }
    else
        await getNote()
    status.value = noteData.value ? "done" : "error"
    updatedNoteId.value = undefined

    window.addEventListener('visibilitychange', async () => {
        if (document.hidden)
            await handleSaveCreate()
    }, false)
})

onBeforeUnmount(async () => {
    if (isNew || updatedFields.size) updatedNoteId.value = noteData.value.id
    await handleSaveCreate()
    window.removeEventListener("visibilitychange", () => { })
})

async function handleSaveCreate() {
    if (!noteData.value) return
    if (isNew)
        await createNote()
    else
        await updateNote()
}

async function getNote() {
    const [n, c] = await Promise.all([NotesService.getNoteById(noteId), NotesService.getNoteContentById(noteId)])

    if (n) noteData.value = n
    if (c) content.value = c.content || ''
}

async function createNote() {
    isNew = false
    const note = { ...noteData.value, content: content.value }
    if (!note.title && !note.content) {
        mutation.setMsg("Nothing to save. Note discarted!")
        return
    }
    const res = await NotesService.createNote(note)
    if (!res || !res[0] || !res[1])
        mutation.setMsg("Unable to save Note!")
}

async function updateNote() {
    let res, res2

    if (updatedFields.has("content")) {
        res2 = await NotesService.saveNoteContent(noteData.value.id, content.value)
        if (res2) {
            updatedFields.delete("content")
        }
    }

    if (updatedFields.size) {
        res = await NotesService.saveNoteFields({ ...noteData.value }, updatedFields)
        if (res) {
            updatedFields.clear()
        }
        else
            mutation.setMsg("Unable to save Note!")
    }
}

function contentUpdate() {

    const str = document.querySelector('#editor-root #editor')?.innerHTML
    if (!str) return
    content.value = str

    if (isNew) return
    updatedFields.add("content")
}

function handleFormChange(e: Event) {
    if (isNew) return

    const field = (e.target as HTMLInputElement).name as keyof Note

    updatedFields.add(field)
}
</script>

<template>
    <loader v-if="status === 'pending'" class="center"></loader>
    <div v-else-if="status === 'done'">

        <Protected id="note-lock" :locked="noteData.is_locked">

            <Head>
                <Title>{{ noteData?.title || 'Untitled' }}</Title>
            </Head>

            <form @change="handleFormChange">
                <content-editor type="note" :name="KEY" :content="content" :update="contentUpdate"></content-editor>
            </form>

        </Protected>

    </div>
    <div v-else class="p-absolute text-center" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <h1>ERROR 404 Note not found!</h1>
        <button class="oui-button" @click="useUI().goBack" title="Back or to Home">Back</button>
    </div>
</template>

<style scoped>
input {
    height: 2rem;
}

textarea {
    height: 50%;
    width: 100%;
}

input,
textarea {
    background: transparent;
    outline: transparent;
    border: none;
}
</style>
