import * as EditorRange from "./editorRange"

export const useEditor = () => ((editorEl: HTMLDivElement, onChange?: (content: string) => void) => {

    const sendChanges = () => onChange && onChange(editorEl.innerHTML)

    const state = {
        isEnabled: false
    }
    const config = {
        classPrefix: "pr-",
        btnSelector: '.editor-btn',
    }

    const BR = () => document.createElement('br')
    const BOLD = () => document.createElement('strong')
    const CODE = () => document.createElement('code')
    const ITALIC = () => document.createElement('em')
    const U = () => document.createElement('u')
    const S = () => document.createElement('s')
    const LINK = (url: string) => {
        const link = document.createElement('a')
        link.href = url
        link.target = "_blank"
        return link
    }
    const NOTE = () => {
        const node = document.createElement('span')
        node.classList.add(config.classPrefix + 'note')
        return node
    }
    const TEXTBOX = () => {
        const node = document.createElement('div')
        node.classList.add(config.classPrefix + 'textbox')
        return node
    }
    const ALIGN_LEFT = () => {
        if (IS_ALIGN_CENTER()) {
            UN_ALIGN_CENTER()
        }
        if (IS_ALIGN_RIGHT()) {
            UN_ALIGN_RIGHT()
        }
    }
    const ALIGN_CENTER = () => {
        if (IS_ALIGN_LEFT()) {
            UN_ALIGN_LEFT()
        }
        if (IS_ALIGN_RIGHT()) {
            UN_ALIGN_RIGHT()
        }
        const node = document.createElement('div')
        node.classList.add(config.classPrefix + 'align-center')
        return node
    }
    const ALIGN_RIGHT = () => {
        if (IS_ALIGN_LEFT()) {
            UN_ALIGN_LEFT()
        }
        if (IS_ALIGN_CENTER()) {
            UN_ALIGN_CENTER()
        }
        const node = document.createElement('div')
        node.classList.add(config.classPrefix + 'align-right')
        return node
    }

    const TEXT_COLOR = () => {
        const node = document.createElement('span')
        getColorInput().then(color =>
            node.style.color = color
        )
        return node
    }

    const BG_COLOR = () => {
        const node = document.createElement('span')
        getColorInput().then(color =>
            node.style.backgroundColor = color
        )
        return node
    }

    const IS_SPAN = () => EditorRange.isWrappedWith("SPAN")
    const IS_BOLD = () => EditorRange.isWrappedWith("STRONG")
    const IS_CODE = () => EditorRange.isWrappedWith("CODE")
    const IS_ITALIC = () => EditorRange.isWrappedWith("EM")
    const IS_U = () => EditorRange.isWrappedWith("U")
    const IS_S = () => EditorRange.isWrappedWith("S")
    const IS_LINK = () => EditorRange.isWrappedWith("A")

    const IS_NOTE = () => {
        return EditorRange.isWrappedWithClassName(config.classPrefix + "note")
    }
    const IS_ALIGN_LEFT = () => {
        return !(EditorRange.isWrappedWithClassName(config.classPrefix + "align-center") || EditorRange.isWrappedWithClassName(config.classPrefix + "align-right"))
    }
    const IS_ALIGN_CENTER = () => {
        return EditorRange.isWrappedWithClassName(config.classPrefix + "align-center")
    }
    const IS_ALIGN_RIGHT = () => {
        return EditorRange.isWrappedWithClassName(config.classPrefix + "align-right")
    }

    const IS_TEXT_COLOR = () => {
        return EditorRange.isWrappedWithStyle("color")
    }

    const IS_BG_COLOR = () => {
        return EditorRange.isWrappedWithStyle("backgroundColor")
    }

    const IS_TEXTBOX = () => {
        return EditorRange.isWrappedWithClassName(config.classPrefix + "textbox")
    }

    const DO_BR = () => EditorRange.insert(BR())

    const DO_TEXTBOX = () => EditorRange.insert(TEXTBOX())
    const DO_BOLD = () => EditorRange.surround(BOLD())
    const DO_CODE = () => EditorRange.surround(CODE())
    const DO_ITALIC = () => EditorRange.surround(ITALIC())
    const DO_U = () => EditorRange.surround(U())
    const DO_S = () => EditorRange.surround(S())
    const DO_LINK = (url: string) => EditorRange.surround(LINK(url))
    const DO_NOTE = () => EditorRange.surround(NOTE())

    const DO_ALIGN_LEFT = () => /* EditorRange.surround */(ALIGN_LEFT())
    const DO_ALIGN_CENTER = () => EditorRange.surround(ALIGN_CENTER())
    const DO_ALIGN_RIGHT = () => EditorRange.surround(ALIGN_RIGHT())
    const DO_TEXT_COLOR = () => EditorRange.surround(TEXT_COLOR())
    const DO_BG_COLOR = () => EditorRange.surround(BG_COLOR())


    const UN_BOLD = () => EditorRange.undo("STRONG")
    const UN_CODE = () => EditorRange.undo("CODE")
    const UN_ITALIC = () => EditorRange.undo("EM")
    const UN_U = () => EditorRange.undo("U")
    const UN_S = () => EditorRange.undo("S")
    const UN_LINK = () => EditorRange.unwrapWith("A")
    const UN_NOTE = () => EditorRange.undo({ className: config.classPrefix + "note", tagName: "SPAN" })

    const UN_ALIGN_LEFT = () => { }
    const UN_ALIGN_CENTER = () => EditorRange.undo({ className: config.classPrefix + "align-center", tagName: "DIV" })
    const UN_ALIGN_RIGHT = () => EditorRange.undo({ className: config.classPrefix + "align-right", tagName: "DIV" })
    const UN_TEXT_COLOR = () => EditorRange.unWrappedStyle("color")
    const UN_BG_COLOR = () => EditorRange.unWrappedStyle("background-color")
    const UN_TEXTBOX = () => EditorRange.undo({ className: config.classPrefix + "textbox", tagName: "DIV" })

    function enable() {
        document.addEventListener('selectionchange', (ev) => {
            document.querySelectorAll<HTMLButtonElement>(config.btnSelector).forEach(button => {
                let isActive = false;
                let value: string

                switch (button.dataset.wrapTag) {
                    case "EM":
                        isActive = !!IS_ITALIC()
                        break;
                    case "STRONG":
                        isActive = !!IS_BOLD()
                        break;
                    case "U":
                        isActive = !!IS_U()
                    case "CODE":
                        isActive = !!IS_CODE()
                        break;
                    case "LINK":
                        isActive = !!IS_LINK()
                        break;
                    case "NOTE":
                        isActive = !!IS_NOTE()
                        break;
                    case "ALIGN_LEFT":
                        isActive = !!IS_ALIGN_LEFT()
                        break;
                    case "ALIGN_CENTER":
                        isActive = !!IS_ALIGN_CENTER()
                        break;
                    case "ALIGN_RIGHT":
                        isActive = !!IS_ALIGN_RIGHT()
                        break;

                    case "TEXT_COLOR":
                        value = IS_TEXT_COLOR()
                        if (value)
                            button.style.color = value // "2px solid " + value + " !important"
                        else
                            button.style.removeProperty("color")
                        isActive = !!value
                        break;

                    case "BG_COLOR":
                        value = IS_BG_COLOR()
                        if (value)
                            button.style.backgroundColor = value
                        else
                            button.style.removeProperty("background-color")
                        isActive = !!value
                        break;
                }

                isActive ? button.classList.add('active') : button.classList.remove('active')
            })
            state.isEnabled = true
        })
    }

    function btnClick(event: Event, value?: string) {
        const t = event.currentTarget as HTMLAnchorElement

        if (!t?.dataset) return

        event.preventDefault()
        switch (t.dataset['wrapTag']) {
            case "STRONG":
                !!IS_BOLD() ? UN_BOLD() : DO_BOLD()
                break;
            case "EM":
                !!IS_ITALIC() ? UN_ITALIC() : DO_ITALIC()
                break;
            case "U":
                !!IS_U() ? UN_U() : DO_U()
                break;
            case "S":
                !!IS_S() ? UN_S() : DO_S()
                break;
            case "TEXTBOX":
                !!IS_TEXTBOX() ? UN_TEXTBOX() : DO_TEXTBOX()
                break;
            case "CODE":
                !!IS_CODE() ? UN_CODE() : DO_CODE()
                break;
            case "LINK":
                if (!!IS_LINK()) {
                    UN_LINK()
                } else {
                    const range = EditorRange.getRange()
                    if (!range || range.collapsed) return

                    const url = prompt("URL")
                    if (url === null || url === "") return
                    DO_LINK(url)
                }
                break;
            case "NOTE":
                !!IS_NOTE() ? UN_NOTE() : DO_NOTE()
                break;
            case "ALIGN_LEFT":
                !!IS_ALIGN_LEFT() ? UN_ALIGN_LEFT() : DO_ALIGN_LEFT()
                break;
            case "ALIGN_CENTER":
                !!IS_ALIGN_CENTER() ? UN_ALIGN_CENTER() : DO_ALIGN_CENTER()
                break;
            case "ALIGN_RIGHT":
                !!IS_ALIGN_RIGHT() ? UN_ALIGN_RIGHT() : DO_ALIGN_RIGHT()
                break;
            case "TEXT_COLOR":
                !!IS_TEXT_COLOR() ? UN_TEXT_COLOR() : DO_TEXT_COLOR()
                break;
            case "BG_COLOR":
                !!IS_BG_COLOR() ? UN_BG_COLOR() : DO_BG_COLOR()
                break;
        }

        sendChanges()
    }

    async function getColorInput() {
        const tmp = document.createElement("input")
        tmp.type = "color"
        tmp.click()
        function rm() {
            tmp?.removeEventListener("change", () => {
                tmp?.remove()
                console.log("removed");
            })
        }
        return new Promise<string>((res, rej) => {
            setTimeout(() => {
                rm()
                rej("timeout")
            }, 10000);
            tmp.addEventListener("change", (ev) => {
                rm()
                res(tmp.value)
            })
        })
    }


    function escapeHtml(str: string) {
        return str.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/'/g, "'");
    }

    function handleEditorKeydown(ev: KeyboardEvent) {
        switch (ev.key) {
            case "Enter":
                ev.preventDefault()
                DO_BR()
                sendChanges()
                break;
        }
    }

    // document.querySelectorAll<HTMLButtonElement>(config.btnSelector).forEach(button => {
    //     button.addEventListener('click', toolbarBtnClick)
    // })

    // const lst = new MutationObserver((muta) => {
    // })
    // lst.observe(editorEl, { characterData: true, childList: true, attributes: true, attributeFilter: ["class", "data"] })

    return {
        btnClick,
        enable,
        state,
        handleEditorKeydown,
        disable() {
            document.removeEventListener('selectionchange', () => { state.isEnabled = false })
            // lst.disconnect()
        }
    }
})
