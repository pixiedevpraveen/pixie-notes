<script setup lang="ts">
import { Note } from '@/models/note';
import { getNewNote, updatableFields } from '@/composables/noteUtils';
import { NotesService } from '@/composables/dbServices';


const mutation = useMutation()
const route = useRoute()
const updatedFields = new Set<keyof Note>()

const noteId = route.params.noteId
const KEY = 'note.' + noteId
const noteData = useState<Note>(KEY)
const content = ref('')
const status = ref<'pending' | 'done' | 'error'>('pending')

let isNew = false
let contentTimeoutId: ReturnType<typeof setTimeout>
let noteTimeoutId: ReturnType<typeof setTimeout>

async function getNote() {
    const [n, c] = await Promise.all([NotesService.getNoteById(noteId), NotesService.getNoteContentById(noteId)])

    if (n) noteData.value = n
    if (c) content.value = c.content || ''
}

async function createNote() {
    const note = { ...noteData.value, content: content.value }
    if (!note.title && !note.content) {
        mutation.setMsg("Nothing to save. Note discarted!")
        return
    }
    const res = await NotesService.createNote(note)
    if (!res || !res[0] || !res[1])
        mutation.setMsg("Unable to save Note!")
}

async function updateNote(saveNote = true) {
    let res
    if (saveNote)
        res = await NotesService.saveNoteFields({ ...noteData.value }, updatedFields)
        // res = await NotesService.saveNote({ ...noteData.value }, false)
    else
        res = await NotesService.saveNoteContent(noteData.value.id, content.value)

    if (!res) {
        mutation.setMsg("Unable to save Note!")
    } else
        updatedFields.clear()
}

onMounted(async () => {
    if (route.query.create === "true") {
        isNew = true
        noteData.value = getNewNote()
        navigateTo({ query: { noteId: noteData.value.id, mode: 'edit' } }, { replace: true })
    }
    else
        await getNote()
    status.value = noteData.value ? "done" : "error"
})

onBeforeUnmount(async () => {
    if (!noteData.value) return
    if (isNew) await createNote()
})

function contentUpdate() {

    const str = document.querySelector('#editor-root #editor')?.innerHTML
    if (!str) return
    content.value = str

    if (isNew) return

    clearTimeout(contentTimeoutId)
    contentTimeoutId = setTimeout(async () => {
        await updateNote(false)
    }, 1000);
}

function handleFormChange(e: Event) {
    if (isNew) return

    const field = (e.target as HTMLInputElement).name as keyof Note
    console.log(field);

    if (updatableFields.has(field)) updatedFields.add(field)
    clearTimeout(noteTimeoutId)
    noteTimeoutId = setTimeout(async () => {
        await updateNote()
    }, 1000);
}
</script>

<template>
    <loader v-if="status === 'pending'" class="center"></loader>
    <div v-else-if="status === 'done'">

        <Protected id="note-lock" :locked="noteData.is_locked">

            <Head>
                <Title>{{ noteData?.title }}</Title>
            </Head>

            <form @change="handleFormChange">
                <content-editor type="note" :name="KEY" :content="content" :update="contentUpdate"></content-editor>
            </form>

        </Protected>

    </div>
    <div v-else class="p-absolute text-center" style="top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <h1>ERROR 404 Note not found!</h1>
        <button class="oui-button" @click="$router.replace('/notes')">Back</button>
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
