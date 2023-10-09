import { emptySelection } from "./utils"

export const useUI = () => ({
    goBack(checkSelection=true) {
        if (checkSelection && emptySelection()) return
        const router = useRouter()
        router.options.history.state.back ? router.back() : router.replace('/')
    }
})
