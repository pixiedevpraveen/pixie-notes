<script setup lang="ts">
import { getDateOrTime } from '@/composables/utils';
import { Note } from '@/models/note';
import { NotesService } from '@/composables/dbServices';
useHead({
    title: "Notes"
})

const { category } = defineProps<{ category: "all" | "favourite" | "locked"/*  | "bin" */ }>()

const route = useRoute()
const notes = useState<Note[]>('notes', () => [])
const updatedNoteId = useState<string>("updatedNoteId")
const prevCategory = useState<typeof category>("prevCategory")
const title = ref("All notes")
const pending = ref(false)
const page = useState('notesPage', () => 1)
let attr: keyof Note
let value: unknown
let obs: IntersectionObserver
const MAX_NOTE_PER_PAGE = 16

const selected = useState('selected', () => new Set<Note['id']>())
const lockSelected = ref(new Set<string>())
const favSelected = ref(new Set<string>())
const order = ref<{ by: keyof Note, asc: boolean, pinFav: boolean }>({ by: "updated", asc: false, pinFav: true })
const orderOptions = new Map<typeof order.value.by, string>([["title", "Title"], ["created", "Date created"], ["updated", "Date updated"]])
const search = useState('search', () => route.query.q || '')

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

    const od = localStorage.getItem("notes.order." + category)
    if (od) {
        order.value = JSON.parse(od)
    }

    let update = true
    if (notes.value.length) {
        update = false

        if (updatedNoteId.value) {
            const idx = notes.value.findIndex((note) => note.id === updatedNoteId.value)
            const note = await NotesService.getNoteById(updatedNoteId.value)
            if (note && note.is_active) {
                if (attr && note[attr] !== value) return

                if (idx >= 0)
                    notes.value[idx] = note
                else
                    notes.value.push(note)
            }
        }
    }

    if (update || category !== prevCategory.value) {
        await updateNotes()
    }

    window.addEventListener("popstate", (ev) => {
        if (!route.query.search && search.value)
            search.value = ''
    })

    handleNotesEnd()
})

onBeforeUnmount(() => {
    prevCategory.value = category
    window.removeEventListener("popstate", (ev) => { })
})

onUnmounted(() => {
    obs?.disconnect()
})

function handleNotesEnd() {
    const el = document.getElementById("note-end")
    if (!el) return

    obs = new IntersectionObserver((els) => {
        if (page.value * MAX_NOTE_PER_PAGE <= notes.value.length) page.value++

    }, { threshold: [.4] })

    obs.observe(el)
}

async function updateNotes() {
    notes.value = await NotesService.getActiveNotesListWhere(attr, value)
    setTimeout(() => {
        sessionStorage.setItem("notes." + category, JSON.stringify(notes.value))
    }, 500);
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

const sortedNotes = computed(() => {
    let fnotes: Note[] = []
    if (!notes.value.length) return []

    fnotes = notes.value.sort((a, b) => {
        const [ai, bi] = order.value.asc ? [a, b] : [b, a]

        const [av, bv] = order.value.pinFav ? [ai.is_favourite ? 10000000000 : 0, bi.is_favourite ? 10000000000 : 0] : [0, 0]

        let cmp = 0
        const by = order.value.by

        if (typeof ai[by] === "number" && typeof bi[by] === "number") {
            cmp = Number(ai[by]) - Number(bi[by])
        }

        else if (/updated|created/.test(by))
            cmp = (new Date(ai[by as "updated" | "created"]).getTime() - new Date(bi[by as "updated" | "created"]).getTime())

        else if (typeof ai[by] === "string") {
            cmp = ai.title.localeCompare(bi.title)
        }

        return cmp + (av - bv) * (order.value.asc ? -1 : 1)
    })

    return fnotes
})

const searchedNotes = computed(() => {
    return search.value ? sortedNotes.value.filter(n => {
        let qi = 0
        for (let i = 0; qi < search.value.length && i < n.title.length; i++) {
            if (n.title[i].toLowerCase() === search.value[qi].toLowerCase())
                qi++
        }
        return qi === search.value.length
    }) : sortedNotes.value
})

const paginatedNotes = computed(() => page.value ? searchedNotes.value.slice(0, page.value * MAX_NOTE_PER_PAGE) : [])

let searchTimeoutId: ReturnType<typeof setTimeout>
function handleSearch(e: Event) {
    clearTimeout(searchTimeoutId)
    searchTimeoutId = setTimeout(() => {
        search.value = (e.target as HTMLInputElement).value
        navigateTo({ query: { ...route.query, q: search.value } }, { replace: true })
    }, 500);
}

function openSearch() {
    navigateTo({ query: { search: 'search' } })
    setTimeout(() => {
        document.getElementById("notes-search")?.focus()
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

async function updateField(field: keyof Note, value: unknown, where?: unknown) {
    const res = await NotesService.saveNotesFieldByIds(Array.from(selected.value), field, value, where)

    if (res) {
        notes.value.forEach(note => {
            if (selected.value.has(note.id) && (!where || note[field] === where)) {
                (note[field] as any) = value
            }
        })
        clearAll()
    }
}

/* menu actions */
function addAll() {
    if (selected.value.size === notes.value.length) clearAll()
    else selected.value = new Set(notes.value.map(n => n.id))
}

const moveAll: MenuAction = async () => {
    const folder = prompt("Enter folder path", notes.value[0].folder)
    if (folder === null) return
    updateField("folder", folder)
}

const lockAll: MenuAction = async () => {
    const hasUnlock = hasUnlocked()
    updateField("is_locked", hasUnlock, !hasUnlock)
}

const starAll: MenuAction = async () => {
    const hasNonFav = hasNonFavourite()
    updateField("is_favourite", hasNonFav, !hasNonFav)
}

const shareAll: MenuAction = async () => {
    clearAll()
}

const deleteAll: MenuAction = async () => {
    if (!confirm(`Confirm delete ${selected.value.size} note${selected.value.size < 2 ? '' : 's'}?`)) return

    updateField("is_active", !notes.value[0].is_active, notes.value[0].is_active)
}

async function clearAll() {
    selected.value.clear()
    lockSelected.value.clear()
    favSelected.value.clear()
}
</script>

<template>
    <div class="page">
        <loader v-show="pending" />

        <OuiPage :title="selected.size ? `${selected.size} Selected` : 'Notes'"
            :meta="selected.size ? '' : (sortedNotes.length ?? 0) + ' notes'"
            :class="{ 'no-header-title': $route.query.search }">
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
                        <icon name="menu" v-show="!selected.size" class="medium pointer m-2 mx-3"
                            @click="useMutation().openDrawer()" />
                    </anchor>
                    <input v-show="$route.query.search"
                        class="bg-transparent outline-0 py-2 me-3 border-0 font-2x font-bold flex-fill" type="search"
                        @input="handleSearch" :value="search" placeholder="Search" id="notes-search">
                </div>
            </template>
            <template #header-menu v-if="!$route.query.search">
                <anchor @click="openSearch">
                    <icon name="search" v-show="!selected.size" class="pointer m-0" />
                </anchor>
                <client-only>
                    <oui-menu class="fit-content">
                        <template #summary>
                            <icon name="vertical_ellipsis" class="me-2" title="Menu" />
                        </template>
                        <ul class="oui-bubble oui-frosted m-0 p-3">
                            <li class="oui-overlay-bubble-item p-0"
                                @click="selected.size ? false : (selected.add(notes[0].id))">
                                <anchor>Edit</anchor>
                            </li>
                            <li class="oui-overlay-bubble-item p-0">
                                <anchor>View</anchor>
                            </li>
                            <li class="oui-overlay-bubble-item p-0" @click="order.pinFav = !order.pinFav">
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
                            <ul class="oui-bubble oui-frosted m-0 p-3">
                                <li class="oui-overlay-bubble-item text-secondary d-flex align-items-center p-0 ps-1"
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

                    <table class="w-100">
                        <tbody>
                            <TransitionGroup name="bounce">
                                <NuxtLink v-for="note in paginatedNotes" :key="note.id"
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
                <div id="note-end" style="height: 5rem; width: 1rem; transform: translateY(-100%);"></div>

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
                        <icon name="edit" class="no-active-bg colored orange" />
                    </oui-button-floating>
                </NuxtLink>
            </template>
        </OuiPage>

        <lock-dialog v-if="$route.query.verify === 'on'" :onVerify="onVerify ? onVerify : () => $router.back()"
            id="notes-protect" />

    </div>
</template>
