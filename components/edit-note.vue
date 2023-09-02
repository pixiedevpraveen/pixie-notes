<script setup lang="ts">
import { usePocketbase } from '@/composables/pb';
import { useLocalStore } from '@/composables/storage';
import { Note } from '@/models/note';
import snarkdown from "snarkdown";

const { id, close } = defineProps<{ id: string, close: () => void }>()

const key = 'noteData.' + id
const noteData = ref<Note>()
const editing = ref(false)
const localStore = useLocalStore()
let contentTimeoutId: ReturnType<typeof setTimeout>
let noteTimeoutId: ReturnType<typeof setTimeout>
const pb = usePocketbase()

async function getNotes() {
    return await pb.collection("notes").getOne<Note>(id)
}

onMounted(async () => {
    const d = await localStore.getItem<Note>(key)
    if (d) {
        noteData.value = d
    } else {
        noteData.value = await getNotes()
        setTimeout(async () => {
            await localStore.setItem(key, noteData.value)
        }, 200);
    }
})

function contentUpdate(str: string) {
    clearTimeout(contentTimeoutId)
    contentTimeoutId = setTimeout(async () => {
        if (noteData.value) {
            noteData.value.content = str
            await save(noteData.value)
        }
    }, 1000);
}

async function save(data?: Note) {
    console.log("updated", data?.title);
    await localStore.setItem(key, data)
}

watch(noteData, () => {
    clearTimeout(noteTimeoutId)
    noteTimeoutId = setTimeout(async () => {
        save(noteData.value)
    }, 500);
}, { deep: true })

function toHtml(str: string) {
    return snarkdown(str)
}

</script>

<template>
    <OuiPage class="hide-viewing full-interaction sticky-top">

        <Title>{{ noteData?.title }}</Title>

        <template #sticky-top>
            <div class="d-flex text-center align-items-center" v-if="noteData">
                <icon name="less-than" class="medium pointer m-2 mx-3" @click="close()" />
                <input type="text" v-model.lazy="noteData.title">
            </div>
        </template>

        <template #interaction v-if="noteData">
            <!-- <note-editor name="content" :content="noteData.content"></note-editor> -->
            <textarea v-show="editing" class="py-2" name="content"
                @keyup="e => contentUpdate((e.target as HTMLTextAreaElement).value)" :value="noteData.content"></textarea>
            <content-preview :content="toHtml(noteData.content)" @click="editing || (editing = true)"></content-preview>
        </template>

        <template #sticky-bottom>
            <Transition name="pop">
                <MenuItem class="gap-1 py-2 text-center" v-show="false">
                <div>
                    <icon name="folder" />
                    <span class="mt-1">Move</span>
                </div>
                <div>
                    <icon name="lock" />
                    <span class="mt-1">Lock</span>
                </div>
                <div>
                    <icon name="share" />
                    <span class="mt-1">Share</span>
                </div>
                <div>
                    <icon name="trash" />
                    <span class="mt-1">Delete</span>
                </div>
                <div>
                    <icon name="x" />
                    <span class="mt-1">Clear</span>
                </div>
                </MenuItem>
            </Transition>
        </template>
    </OuiPage>
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

/* .oui-lay */
</style>
