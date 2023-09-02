<script setup lang="ts">
import { usePocketbase } from '@/composables/pb';
import { strSlice } from '@/composables/utils';
import { NoteListItem } from '@/models/note';
import { useLocalStore } from '@/composables/storage';

useHead({
    title: "Notes"
})

const route = useRoute()
const router = useRouter()
const localStore = useLocalStore()
const mutation = useMutation()
const selected = ref(new Set<string>())
const notesData = useState<NoteListItem[]>('notesData')
let notesTimeoutId: ReturnType<typeof setTimeout>

async function getNotes() {
    const pb = usePocketbase()
    return await pb.collection("notes_list").getList<NoteListItem>()
}

let key = 'notesData'
onMounted(async () => {
    const d = await localStore.getItem<typeof notesData.value>(key)
    if (d && d.length) {
        notesData.value = d
    } else {
        try {
            const d = await getNotes()

            notesData.value = d.items
        } catch (er) {
            console.log(er);
        }
        setTimeout(async () => {
            await localStore.setItem(key, notesData.value)
        }, 100);
    }
})

function toggleSelect(id: string) {
    if (selected.value.has(id)) selected.value.delete(id)
    else selected.value.add(id)
}

function handleClick(e: Event, id: string) {
    if (selected.value.size) {
        e.preventDefault()
        toggleSelect(id)
    }
}

watch([notesData], () => {
    clearTimeout(notesTimeoutId)
    notesTimeoutId = setTimeout(async () => {
        await localStore.setItem(key, notesData.value)
    }, 500);
})

/* menu actions */
function addAll() {
    if (selected.value.size === notesData.value?.length) clearAll()
    else selected.value = new Set(notesData.value.map(i => i.id))
}
function moveAll() {
    selected.value.clear()
}
function lockAll() {
    // selected.value
}
function shareAll() {
    selected.value.clear()
}
function deleteAll() {
    selected.value.clear()
}
function clearAll() {
    selected.value.clear()
}
</script>

<template>
    <div class="page">
        <OuiPage v-show="!$route.hash.startsWith('#note-')">
            <template #viewing>
                <strong class="oui-viewing-title">{{ selected.size ? `${selected.size} Selected` : "Notes" }}</strong>
            </template>
            <template #sticky-top>
                <div class="d-flex text-center align-items-center\">
                    <div class="d-flex flex-column justify-content-center gap-2" v-show="notesData && selected.size">
                        <icon :name="(selected.size === notesData?.length ? 'check-' : '') + 'square'" class="pointer mx-3"
                            @click="addAll" />
                        <span>All</span>
                    </div>
                    <icon name="menu" v-show="!selected.size" class="medium pointer m-2 mx-3"
                        @click="mutation.openDrawer()" />
                </div>
            </template>
            <template #interaction>
                <oui-bubble-list title="" class="mt-2" v-if="notesData">
                    <li v-for="note in notesData" :key="note.id" class="oui-bubble-item"
                        @contextmenu.prevent="selected.size || toggleSelect(note.id)" @click="e => handleClick(e, note.id)">
                        <NuxtLink :class="{ 'disabled': selected.size }" :to="'#note-' + note.id" class="d-flex">
                            <Icon
                                :name="selected.size ? (selected.has(note.id) ? 'check-square' : 'square') : 'circle-filled'"
                                class="grey medium me-2" :color="note.color" />
                            <div class="row">
                                <strong class="mb-1">{{ strSlice(note.title, 20) }}
                                    <Icon name="lock" class="small" v-if="note.is_locked" />
                                    <Icon name="star-golden" class="small colored" v-if="note.is_favourite" />
                                </strong>
                                <span>{{ note.created?.split(/T|\s/g)[0] }}</span>
                            </div>
                        </NuxtLink>
                    </li>
                </oui-bubble-list>
            </template>
            <template #sticky-bottom>
                <Transition name="pop">
                    <MenuItem class="gap-1 py-2 text-center" v-show="selected.size">
                    <div @click="moveAll">
                        <icon name="folder" />
                        <span class="mt-1">Move</span>
                    </div>
                    <div @click="lockAll">
                        <icon name="lock" />
                        <span class="mt-1">Lock</span>
                    </div>
                    <div @click="shareAll">
                        <icon name="share" />
                        <span class="mt-1">Share</span>
                    </div>
                    <div @click="deleteAll">
                        <icon name="trash" />
                        <span class="mt-1">Delete</span>
                    </div>
                    <div @click="clearAll">
                        <icon name="x" />
                        <span class="mt-1">Clear</span>
                    </div>
                    </MenuItem>
                </Transition>
            </template>
        </OuiPage>
        <Transition name="page">
            <edit-note v-if="$route.hash.startsWith('#note-')" :id="$route.hash.replace('#note-', '')" style="z-index: 2;"
                :close="() => { $router.back() }"></edit-note>
        </Transition>
    </div>
</template>
