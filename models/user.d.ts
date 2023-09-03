import { Json } from "./json";

export type UserListItem = {
    username: string
    id: string
    email: string
    is_admin?: boolean
}

export type User = UserListItem & {
    verified: boolean
    name: string
    avatar: string
    data: Json
    emailVisibility: boolean
    created: string
    updated: string
}
