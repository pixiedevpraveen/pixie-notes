<script setup lang="ts">
import { getDateOrTime } from '@/composables/utils';
import { Note } from '@/models/note';
import { NotesService } from '@/composables/dbServices';

useHead({
    title: "Notes"
})

const { category } = defineProps<{ category: "all" | "favourite" | "locked"/*  | "bin" */ }>()

const route = useRoute()
const notes = ref<Note[]>([])
const title = ref("All notes")
const pending = ref(false)
let attr: keyof Note
let value: unknown

const selected = useState('selected', () => new Set<Note['id']>())
const lockSelected = ref(new Set<string>())
const favSelected = ref(new Set<string>())
const order = ref<{ by: keyof Note, asc: boolean, pinFav: boolean }>({ by: "updated", asc: false, pinFav: true })
const orderOptions = new Map<keyof Note, string>([["title", "Title"], ["created", "Date created"], ["updated", "Date updated"]])
const search = useState('search', () => route.query.search && route.query.q ? route.query.q : '')

onMounted(async () => {

    switch (category) {
        case "favourite":
            attr = "is_favourite"
            value = true
            title.value = "Favourites"
            break;
        case "locked":
            attr = "is_locked"
            value = true
            title.value = "Locked notes"
            break;
        // case "bin":
        //     attr = "is_active"
        //     title.value = "Recycle bin"
        //     value = false
        //     break;
    }

    await updateNotes()

    const od = localStorage.getItem("notes.order." + category)
    if (od) {
        order.value = JSON.parse(od)
    }

    window.addEventListener("popstate", (ev) => {
        if (!route.query.search && search.value)
            search.value = ''
    })
})

onBeforeUnmount(() => {
    window.removeEventListener("popstate", (ev) => { })
})

async function updateNotes() {
    pending.value = true
    notes.value = await NotesService.getActiveNotesListWhere(attr, value)
    pending.value = false
}

function toggleSelect(note: Note) {
    if (selected.value.has(note.id)) selected.value.delete(note.id)
    else selected.value.add(note.id)
    if (note.is_locked) {
        if (lockSelected.value.has(note.id)) lockSelected.value.delete(note.id)
        else lockSelected.value.add(note.id)
    }
    if (note.is_favourite) {
        if (favSelected.value.has(note.id)) favSelected.value.delete(note.id)
        else favSelected.value.add(note.id)
    }
}

function handleClick(e: Event, note: Note) {
    if (selected.value.size) {
        e.preventDefault()
        toggleSelect(note)
    }
}

function filteredNotes() {
    let fnotes = notes.value.sort((a, b) => {
        const ai = order.value.asc ? a : b
        const bi = order.value.asc ? b : a
        let av = (order.value.pinFav && ai.is_favourite) ? 10000000000 : 0
        let bv = (order.value.pinFav && bi.is_favourite) ? 10000000000 : 0

        switch (order.value.by) {
            case "created":
                return (new Date(ai.created).getTime() - new Date(bi.created).getTime()) + (av - bv) * (order.value.asc ? -1 : 1)
            case "title":
                return ai.title.localeCompare(bi.title) + (av - bv) * (order.value.asc ? -1 : 1)
        }
        return (new Date(ai.updated).getTime() - new Date(bi.updated).getTime()) + (av - bv) * (order.value.asc ? -1 : 1)
    })

    if (search.value?.length)
        return fnotes.filter(n => n.title.search(search.value) !== -1)

    return fnotes
}

let searchTimeoutId: ReturnType<typeof setTimeout>
function handleSearch(e: Event) {
    clearTimeout(searchTimeoutId)
    searchTimeoutId = setTimeout(() => {
        search.value = (e.target as HTMLInputElement).value
    }, 500);
}

let orderTimeoutId: ReturnType<typeof setTimeout>
watch(order, (v) => {
    clearTimeout(orderTimeoutId)
    orderTimeoutId = setTimeout(() => {
        localStorage.setItem("notes.order." + category, JSON.stringify(v))
    }, 1000);
}, { deep: true })

type MenuAction = () => void

let onVerify: (verified: boolean) => void

function lockVerify(action: MenuAction) {
    if (pending.value) return

    if (!lockSelected.value.size) {
        action()
        return
    }

    onVerify = () => {
        action()
        useRouter().back()
    }
    navigateTo({ query: { verify: 'on' } })
}

function hasUnlocked() {
    return lockSelected.value.size !== selected.value.size
}

function hasNonFavourite() {
    return favSelected.value.size !== selected.value.size
}

/* menu actions */
function addAll() {
    if (selected.value.size === notes.value.length) clearAll(false)
    else selected.value = new Set(notes.value.map(n => n.id))
}

const moveAll: MenuAction = async () => {
    const folder = prompt("Enter folder path", notes.value[0].folder)
    if (folder === null) return
    const res = await NotesService.saveNotesFieldByIds(Array.from(selected.value), "folder", folder)
    if (res)
        clearAll()
}

const lockAll: MenuAction = async () => {
    const hasUnlock = hasUnlocked()
    const res = await NotesService.saveNotesFieldByIds(Array.from(selected.value), "is_locked", hasUnlock, !hasUnlock)

    if (res) {
        clearAll()
    }
}

const starAll: MenuAction = async () => {
    const hasNonFav = hasNonFavourite()
    const res = await NotesService.saveNotesFieldByIds(Array.from(selected.value), "is_favourite", hasNonFav, !hasNonFav)

    if (res) {
        clearAll()
    }
}

const shareAll: MenuAction = async () => {
    clearAll(false)
}

const deleteAll: MenuAction = async () => {
    if (!confirm(`Confirm delete ${selected.value.size} note${selected.value.size < 2 ? '' : 's'}?`)) return

    const res = await NotesService.saveNotesFieldByIds(Array.from(selected.value), "is_active", !notes.value[0].is_active, notes.value[0].is_active)

    if (res) {
        clearAll()
    }
}

async function clearAll(update = true) {
    if (update)
        await updateNotes()
    selected.value.clear()
    lockSelected.value.clear()
    favSelected.value.clear()
}
</script>

<template>
    <div class="page">
        <loader v-show="pending" />

        <OuiPage :title="selected.size ? `${selected.size} Selected` : 'Notes'"
            :meta="selected.size ? '' : (notes.length ?? 0) + ' notes'" :class="{ 'no-header-title': $route.query.search }">
            <template #viewing>
                {{ selected.size ? `${selected.size} Selected` : title }}
            </template>
            <template #header>
                <div class="d-flex text-center align-items-center" :class="{ 'flex-fill': $route.query.search }">
                    <anchor>
                        <div class="d-flex flex-column justify-content-center gap-2" v-show="notes && selected.size">
                            <icon :name="(selected.size === notes?.length ? 'check-' : '') + 'square'" class="pointer mx-3"
                                @click="addAll" />
                            <span>All</span>
                        </div>
                    </anchor>
                    <anchor>
                        <icon name="previous" v-show="!selected.size" class="pointer m-2 mx-3" @click="$router.back()" />
                    </anchor>
                    <input v-show="$route.query.search" autofocus
                        class="bg-transparent outline-0 py-2 me-3 border-0 font-2x font-bold flex-fill" type="search"
                        @input="handleSearch" :value="search" placeholder="Search">
                </div>
            </template>
            <template #header-menu v-if="!$route.query.search">
                <anchor @click="navigateTo({ query: { search: 'search' } })">
                    <icon name="search" v-show="!selected.size" class="pointer m-0" />
                </anchor>
                <client-only>
                    <oui-menu class="fit-content">
                        <template #summary>
                            <icon name="vertical_ellipsis" class="me-2" title="Menu" />
                        </template>
                        <ul class="oui-bubble oui-frosted">
                            <li class="oui-overlay-bubble-item"
                                @click="selected.size ? false : (selected.add(notes[0].id))">
                                <anchor>Edit</anchor>
                            </li>
                            <li class="oui-overlay-bubble-item">
                                <anchor>View</anchor>
                            </li>
                            <li class="oui-overlay-bubble-item" @click="order.pinFav = !order.pinFav">
                                <anchor>{{ order.pinFav ? 'Unpin favourites from' : 'Pin favourites to' }} top</anchor>
                            </li>
                        </ul>
                    </oui-menu>
                </client-only>
            </template>
            <template #interaction>
                <client-only>
                    <div class="d-flex align-items-center p-relative mx-3 text-secondary">
                        <oui-menu class="ms-auto fit-content">
                            <template #summary>
                                <span class="p-2 rounded-3 text-secondary">{{ orderOptions.get(order.by) }}</span>
                            </template>
                            <ul class="oui-bubble oui-frosted">
                                <li class="oui-overlay-bubble-item text-secondary d-flex align-items-center ps-2"
                                    v-for="[option, text] in orderOptions" :key="option"
                                    :class="{ 'selected': order.by === option }" @click="order.by = option">
                                    {{ text }}
                                    <icon name="check" class="full small colored" v-if="order.by === option" />
                                </li>
                            </ul>
                        </oui-menu>
                        <span>|</span>
                        <anchor @click="order.asc = !order.asc">
                            <icon :name="'arrow-' + (order.asc ? 'up' : 'down')" class="full small grey" />
                        </anchor>
                    </div>
                </client-only>

                <div class="mt-2" v-if="notes?.length">

                    <table>
                        <tbody>
                            <TransitionGroup name="bounce">
                                <NuxtLink v-for="note in filteredNotes()" :key="note.id"
                                    @contextmenu.prevent="selected.size || toggleSelect(note)"
                                    @click="e => handleClick(e, note)"
                                    :to="selected.size ? undefined : '/notes/' + note.id">
                                    <tr class="d-flex align-items-center p-1 rounded-2 m-2">
                                        <td>
                                            <Icon v-if="selected.size > 0"
                                                :name="selected.has(note.id) ? 'check-square' : 'square'"
                                                class="full small grey ms-2" :color="note.color" />
                                        </td>
                                        <td>
                                            <Icon :name="note.is_locked ? 'lock' : 'circle-filled'"
                                                class="medium grey me-1" />
                                        </td>
                                        <td class="row">
                                            <div style="max-width: 70vw; overflow: hidden;">
                                                <strong style="max-width: 90%;"
                                                    class="text-trancated">{{ /* strSlice( */note?.title?.split('\n')[0]/* , 45) */ }}</strong>
                                                <Icon name="star-golden" class="smaller full colored"
                                                    v-if="note.is_favourite" />
                                            </div>
                                            <span class="mt-2">{{ getDateOrTime(note.updated) }}</span>
                                        </td>
                                    </tr>
                                </NuxtLink>
                            </TransitionGroup>
                        </tbody>
                    </table>
                </div>

            </template>
            <template #sticky-bottom>
                <Transition name="pop">
                    <MenuItem class="gap-1 py-2 text-center" v-show="selected.size">
                    <div @click="lockVerify(moveAll)">
                        <icon name="folder" />
                        <span class="mt-1">Move</span>
                    </div>
                    <div @click="lockVerify(lockAll)">
                        <icon :name="(hasUnlocked() ? '' : 'un') + 'lock'" />
                        <span class="mt-1 text-upper-first">{{ (hasUnlocked() ? '' : 'un') + 'lock' }}</span>
                    </div>
                    <div @click="lockVerify(shareAll)">
                        <icon name="share" />
                        <span class="mt-1">Share</span>
                    </div>
                    <div @click="lockVerify(deleteAll)">
                        <icon name="trash" />
                        <span class="mt-1">Delete</span>
                    </div>
                    <div @click="lockVerify(starAll)">
                        <icon :name="'star' + (hasNonFavourite() ? '-golden' : '')"
                            :class="{ colored: hasNonFavourite() }" />
                        <span class="mt-1">Favourite</span>
                    </div>
                    </MenuItem>
                </Transition>
                <NuxtLink to="/notes/new?create=true">
                    <oui-button-floating v-show="!selected.size" class="button-bottom-right pointer shadowed rounded-3 p-1">
                        <icon name="edit" class="no-active-bg" />
                    </oui-button-floating>
                </NuxtLink>
            </template>
        </OuiPage>

        <lock-dialog v-if="$route.query.verify === 'on'" :onVerify="onVerify ? onVerify : () => $router.back()"
            id="notes-protect" />

    </div>
</template>
