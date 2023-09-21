import * as EditorRange from "./editorRange"

export const useEditor = () => ((editorEl: HTMLDivElement, toolbar?: HTMLElement, onChange?: (content: string) => void) => {
    const state = {
        isEnabled: false
    }
    const config = {
        btnSelector: '.editor-btn',
    }

    const BR = () => document.createElement('br')
    const BOLD = () => document.createElement('strong')
    const CODE = () => document.createElement('code')
    const ITALIC = () => document.createElement('em')
    const U = () => document.createElement('u')
    const S = () => document.createElement('s')
    const NOTE = () => {
        const node = document.createElement('div')
        node.classList.add('note')
        return node
    }
    const LINK = (url: string) => {
        const link = document.createElement('a')
        link.href = url
        return link
    }

    const IS_BOLD = () => EditorRange.isWrappedWith("STRONG")
    const IS_CODE = () => EditorRange.isWrappedWith("CODE")
    const IS_ITALIC = () => EditorRange.isWrappedWith("EM")
    const IS_U = () => EditorRange.isWrappedWith("U")
    const IS_S = () => EditorRange.isWrappedWith("S")
    const IS_NOTE = () => {
        return EditorRange.isWrappedWithClassName("note")
    }
    const IS_LINK = () => EditorRange.isWrappedWith("A")

    const DO_BR = () => EditorRange.insert(BR())

    const DO_BOLD = () => EditorRange.surround(BOLD())
    const DO_CODE = () => EditorRange.surround(CODE())
    const DO_ITALIC = () => EditorRange.surround(ITALIC())
    const DO_U = () => EditorRange.surround(U())
    const DO_S = () => EditorRange.surround(S())
    const DO_NOTE = () => EditorRange.surround(NOTE())
    const DO_LINK = (url: string) => EditorRange.surround(LINK(url))

    const UNBOLD = () => EditorRange.undo("STRONG")
    const UNCODE = () => EditorRange.undo("CODE")
    const UNITALIC = () => EditorRange.undo("EM")
    const UNU = () => EditorRange.undo("U")
    const UNS = () => EditorRange.undo("S")
    const UNNOTE = () => EditorRange.undo({ className: "note", tagName: "DIV" })
    const UNLINK = () => EditorRange.unwrapWith("A")

    function escapeHtml(str: string) {
        return str.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/'/g, "'");
    }

    function handleEditorKeydown(ev: KeyboardEvent) {
        // console.log(ev.key);
        switch (ev.key) {
            case "Enter":
                DO_BR()
                ev.preventDefault()
                break;
        }
    }

    function enable() {

        document.addEventListener('selectionchange', (ev) => {
            document.querySelectorAll<HTMLButtonElement>(config.btnSelector).forEach(button => {
                let isActive = false;

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
                }

                isActive ? button.classList.add('active') : button.classList.remove('active')
            })
            state.isEnabled = true
        })
    }

    function btnClick(event: Event) {
        const t = event.currentTarget as HTMLButtonElement
        if (!t?.dataset) return

        event.preventDefault()
        switch (t.dataset['wrapTag']) {
            case "STRONG":
                IS_BOLD() ? UNBOLD() : DO_BOLD()
                break;
            case "EM":
                IS_ITALIC() ? UNITALIC() : DO_ITALIC()
                break;
            case "U":
                IS_U() ? UNU() : DO_U()
                break;
            case "S":
                IS_S() ? UNS() : DO_S()
                break;
            case "CODE":
                IS_CODE() ? UNCODE() : DO_CODE()
                break;
            case "LINK":
                if (IS_LINK()) {
                    UNLINK()
                } else {
                    const range = EditorRange.getRange()
                    if (!range || range.collapsed) return

                    const url = prompt("URL")
                    if (url === null || url === "") return
                    DO_LINK(url)
                }
                break;
            case "NOTE":
                IS_NOTE() ? UNNOTE() : DO_NOTE()
                break;
        }
        onChange && onChange(editorEl.innerHTML);
    }

    // document.querySelectorAll<HTMLButtonElement>(config.btnSelector).forEach(button => {
    //     button.addEventListener('click', toolbarBtnClick)
    // })

    // const lst = new MutationObserver((muta) => {
    //     console.log(muta, muta[0].type);
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
