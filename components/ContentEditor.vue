<script setup lang="ts">
import { useEditor } from "@/composables/editor";
import { toggleFullscreen, getDateOrTime } from "@/composables/utils";
import { Note } from "@/models/note";
import { Page } from "@/models/Page";

const { name, update, content, type } = defineProps<{ name: string, type: "note" | "page", content: string, update: (md: string) => void/* , readmode: boolean */ }>()

type ContentType = Note & Page

// type ContentType = {
//     id: string
//     title: string
//     is_active: boolean
//     is_md: boolean
//     created: string
//     updated: string
//     keywords: string
//     user: string

//     is_favourite?: boolean
//     is_locked?: boolean
//     folder?: string

//     is_indexed?: boolean
//     is_public?: boolean
//     description?: string
//     categories?: string[]
//     page_type: PageType
// }

type ModeType = 'lock' | 'edit' | 'search'

const data = useState<ContentType>(name)
const html = content
const route = useRoute()
const Editor = useEditor()
let editor: ReturnType<typeof Editor>
const setting = useSetting()
const search = useState<string>('note-search', route.query.search)

const editorEl = ref<HTMLDivElement>()
let toolbarEl: HTMLDivElement

function getEditorEl() {
    return document.querySelector("#editor") as HTMLDivElement
}

onMounted(() => {
    toolbarEl = document.querySelector('#editor-root>#toolbar') as HTMLDivElement
    if (editorEl.value && toolbarEl) {
        editor = Editor(editorEl.value, toolbarEl, sendContent)
        editor.enable()
    }
})

function navigate(v: ModeType) {
    navigateTo({ query: { ...route.query, mode: v } }, route.query.mode ? { replace: true } : undefined)
}

let contentTimeoutId: ReturnType<typeof setTimeout>
function sendContent() {
    clearTimeout(contentTimeoutId)
    contentTimeoutId = setTimeout(async () => {
        console.log("contentEditor: content changes");
        if (editorEl.value) {
            update(editorEl.value.innerHTML)
            console.log("content sent");
        } else {
            console.log(editorEl.value);
        }
    }, 1000);
}

function handleInput(/* e: Event */) {
    sendContent()
}

function toggleMode(mode: ModeType, override = false) {
    let _mode = route.query.mode
    switch (mode) {
        case 'edit':
            if (override || route.query.mode !== 'lock') _mode = 'edit'
            break;

        case 'lock':
            _mode = 'lock'
            break;

        case 'search':
            _mode = 'search'
            break;
    }
    if (route.query.mode !== _mode) navigate(_mode)
}

const toolbarBtns: { [tag: string]: { icon?: string, label?: string } } = {
    STRONG: { icon: "bold" },
    EM: { icon: "italic" },
    U: { icon: "underline" },
    S: { icon: "strike" },
    CODE: { icon: "code" },
    LINK: { icon: "link" },
    // NOTE: { label: "Note" }
}

</script>

<template>
    <div class="oui-interaction" :data-mode="$route.query.mode">

        <div class="oui-header sticky px-2 py-1">
            <div class="oui-header-expanded flex-fill">
                <icon name="previous" class="pointer" @click="$router.back()" data-expand="rotate-90" />
                <div class="ms-auto" data-expand="show">
                    <anchor v-if="type === 'note'" @click="data.is_favourite = !data.is_favourite">
                        <input type="checkbox" v-model="data.is_favourite" name="is_favourite" class="hidden">
                        <icon :name="'star' + (data.is_favourite ? '-golden' : '')"
                            :class="{ colored: data.is_favourite }" />
                    </anchor>
                </div>
                <input v-show="$route.query.mode !== 'search'"
                    class="oui-input-title flex-fill bg-transparent outline-0 py-2 border-0 font-2x font-bold" type="text"
                    v-model="data.title" name="title" placeholder="Untitled">
                <div class="flex-fill" data-expand="show">
                    <input v-if="type === 'note'" class="bg-transparent outline-0 py-2 border-0 font-3x" type="text"
                        name="folder" placeholder="Folders" v-model="data.folder">
                    <table class="mb-2">
                        <tbody>
                            <tr v-if="data.updated">
                                <td class="pt-1 pe-1">Last Modified:</td>
                                <td>{{ getTime(data.updated) }}</td>
                            </tr>
                            <tr>
                                <td class="pt-1 pe-1">Created:</td>
                                <td>{{ getDateOrTime(data.created) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <div v-show="$route.query.mode === 'search'" class="flex-fill">
                <div class="d-flex text-center justify-content-between align-items-center">
                    <input class="bg-transparent outline-0 py-2 border-0 font-2x font-bold" type="search" v-model="search"
                        placeholder="Search">
                    <div>
                        <anchor v-show="$route.query.mode !== 'edit'">
                            <icon name="previous" class="grey pointer rotate--90" />
                        </anchor>
                        <anchor v-show="$route.query.mode !== 'edit'">
                            <icon name="previous" class="grey pointer rotate-90" />
                        </anchor>
                    </div>
                </div>
            </div>
            <div v-show="$route.query.mode !== 'search'"
                class="d-flex text-center justify-content-between align-items-center" data-expand="hide">
                <div class="d-flex justify-content-end flex-fill">
                    <anchor v-show="$route.query.mode !== 'edit'">
                        <icon name="edit" class="pointer m-0" @click="toggleMode('edit', true)" />
                    </anchor>
                    <anchor v-show="$route.query.mode !== 'edit'">
                        <icon name="search" class="pointer m-0" @click="toggleMode('search')" />
                    </anchor>
                    <anchor v-show="$route.query.mode === 'edit'">
                        <icon name="book-open" class="pointer m-0" @click="toggleMode('lock')" />
                    </anchor>
                    <oui-menu v-show="$route.query.mode === 'edit'" title="Insert">
                        <template #summary>
                            <icon name="paperclip" class="pointer m-0" />
                        </template>
                        <ul class="oui-bubble oui-frosted">
                            <li class="oui-overlay-bubble-item d-flex justify-content-between gap-2">
                                <div class="flex-fill d-flex flex-column gap-2">
                                    <anchor class="d-flex align-items-center bordered rounded-2">
                                        <icon name="image" class="medium pointer" /> <span>Image</span>
                                    </anchor>
                                    <anchor class="d-flex align-items-center bordered rounded-2">
                                        <icon name="image" class="medium pointer" /> <span>Scan</span>
                                    </anchor>
                                </div>
                                <div class="flex-fill d-flex flex-column gap-2">
                                    <anchor class="d-flex align-items-center bordered rounded-2">
                                        <icon name="image" class="medium pointer" /> <span>Camera</span>
                                    </anchor>
                                    <anchor class="d-flex align-items-center bordered rounded-2">
                                        <icon name="image" class="medium pointer" /> <span>PDF</span>
                                    </anchor>
                                </div>
                            </li>
                            <hr />
                            <li class="oui-overlay-bubble-item">
                                <anchor class="d-flex align-items-center">
                                    <icon name="textbox" class="medium pointer" /> Text box
                                </anchor>
                            </li>
                            <li class="oui-overlay-bubble-item" title="Add hand drawn drawing">
                                <anchor class="d-flex align-items-center">
                                    <icon name="palette" class="medium pointer" /> Drawing
                                </anchor>
                            </li>
                        </ul>
                    </oui-menu>
                    <oui-menu>
                        <template #summary>
                            <icon name="vertical_ellipsis" class="pointer m-0" />
                        </template>
                        <ul class="oui-bubble oui-frosted">
                            <li class="oui-overlay-bubble-item"
                                @click="toggleFullscreen(getEditorEl().parentElement as HTMLDivElement)"
                                title="Toggle Full screen">
                                <anchor>Full screen</anchor>
                            </li>
                            <li class="oui-overlay-bubble-item" data-mode-edit="hide" title="Add as a shortcut to">
                                <anchor class="disabled">Add to Home</anchor>
                            </li>
                            <li class="oui-overlay-bubble-item">
                                <anchor class="disabled">Tags</anchor>
                            </li>
                            <li class="oui-overlay-bubble-item">
                                <anchor class="disabled">Save as file</anchor>
                            </li>
                            <li v-if="!setting.autoSaveNotes.value" class="oui-overlay-bubble-item" @click="sendContent()"
                                title="Save Note">
                                <anchor>Save</anchor>
                            </li>
                            <li class="oui-overlay-bubble-item" data-mode-edit="hide">
                                <anchor class="disabled">Print</anchor>
                            </li>
                            <hr />
                            <li class="oui-overlay-bubble-item d-flex justify-content-around gap-2">
                                <anchor>
                                    <label v-if="type === 'note'" class="pointer">
                                        <input type="checkbox" v-model="data.is_favourite" name="is_favourite"
                                            class="hidden">
                                        <icon :name="'star' + (data.is_favourite ? '-golden' : '')"
                                            :class="{ colored: data.is_favourite }" />
                                    </label>
                                </anchor>
                                <label v-if="type === 'note'" data-mode-edit="hide">
                                    <input type="checkbox" v-model="data.is_locked" name="is_locked" class="hidden">
                                    <icon :name="(data.is_locked ? '' : 'un') + 'lock'" />
                                </label>
                                <anchor class="disabled">
                                    <icon name="share" />
                                </anchor>
                                <label>
                                    <input type="checkbox" v-model="data.is_active" name="is_active" class="hidden">
                                    <icon name="trash" />
                                </label>
                            </li>
                        </ul>
                    </oui-menu>
                </div>
            </div>
        </div>

        <div class="oui-dialog-mask"></div>

        <div id="editor-root" class="d-flex flex-column">
            <pcoder-web ref="editorEl" v-if="data" id="editor" class="selectable px-2"
                @keydown="e => editor && editor.handleEditorKeydown(e)" v-html="html" @input="handleInput"
                :contenteditable="$route.query.mode === 'edit'" @click="toggleMode('edit')"></pcoder-web>

            <oui-button-floating class="button-top-right pointer shadowed rounded-3 square" data-fullscreen="show" @click="toggleFullscreen">
                <Icon name="minimize" class="full smaller button-minimize no-active-bg" />
            </oui-button-floating>

            <div id="toolbar" data-mode-edit="push">
                <anchor v-for="(attr, tag) of toolbarBtns" :key="tag" :data-wrap-tag="tag"
                    @click="e => editor && editor.btnClick(e)" class="editor-btn">
                    <icon v-if="attr.icon" :name="attr.icon" class="small full" />
                    <strong v-else>{{ attr.label }}</strong>
                </anchor>
            </div>
        </div>

    </div>
</template>

<style scoped>
@import "@/assets/css/editor-core.css";

:fullscreen #editor {
    background: var(--background);
    padding-top: 0;
}

[data-fullscreen=show] {
    display: none;
}
:fullscreen [data-fullscreen=show] {
    display: block;
}

.oui-header {
    border-bottom: 1px solid #80808050;
}

#editor {
    --editor-height: 100vh;
    min-height: var(--editor-height);
    outline: transparent;
    padding-top: 3.5rem;
    padding-bottom: 5rem;
    overflow-y: scroll !important;
    max-height: 100vh;
}

#editor *:focus-within {
    color: red !important;
    background-color: red;
}

#splitter {
    width: 100%;
    height: 1rem;
    background-color: grey;
    display: grid;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.oui-header {
    max-width: 100%;
}

[data-mode=search] .oui-header-expanded {
    flex: none !important;
}

.oui-header-expanded {
    display: flex;
}

.oui-header {
    z-index: 10001;
}

.oui-dialog-mask {
    opacity: .1;
    background: white;
}

.oui-dialog-mask {
    display: none;
}

.oui-header-expanded,
.oui-header-expanded>*:not(input) {
    transition: all var(--transition);
}

.oui-header-expanded:focus-within {
    flex-wrap: wrap;
}

.oui-header-expanded:focus-within input {
    width: 100%;
    font-size: large;
}

.rotate-90,
.oui-header-expanded:focus-within [data-expand=rotate-90] {
    rotate: 90deg;
}

.rotate--90 {
    rotate: -90deg;
}

.oui-header-expanded:focus-within~[data-expand=hide] {
    display: none !important;
}

[data-mode-edit=push],
[data-expand] {
    transition: all var(--transition);
}

.oui-header-expanded:not(:focus-within) [data-expand=show],
.oui-header-expanded:not(:focus-within)~[data-expand=show] {
    display: none;
}

[data-mode=edit] [data-mode-edit=hide] {
    display: none;
}

[data-mode-edit=push] {
    transform: translateY(10vh);
}

[data-mode="edit"] [data-mode-edit=push] {
    transform: none;
}


#toolbar {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--background);
    display: flex;
    gap: 1rem;
    background-color: var(--textual-background);
    justify-content: space-evenly;
}

/* .editor-btn {} */

.editor-btn.active {
    font-weight: bold;
    background-color: var(--background);
}
</style>
