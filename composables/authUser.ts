import { User } from "@/models/user"

export const useAuthUser = () => useState<User>('authUser', defaultUser)

export function defaultUser(): User {
    return {
        id: '',
        verified: false,
        name: '',
        username: '',
        email: '',
        emailVisibility: false,
        is_admin: false,
        avatar: '',
        data: {},
        created: '',
        updated: ''
    }
}
