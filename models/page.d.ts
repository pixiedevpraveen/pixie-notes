import { Json } from "./json";
import { UserListItem } from "./user";

type PageType = "page" | "route" | "tool" | "blog" | "material" | "other"

const PAGE_TYPES = new Set(["page", "route", "tool", "blog", "material", "other"])

const PAGE_UPDATABLE_FIELDS = new Set(['page_type', 'is_active', 'is_indexed', 'is_public', 'title', 'content', 'slug', 'description', 'categories', 'keywords', 'data'])

type PageListItem = {
    page_type: PageType
    title: string
    slug: string
    created: string
    categories: string
}

type Page = PageListItem & {
    id: string
    user: string | UserListItem
    is_active: boolean
    is_indexed: boolean
    is_public: boolean
    is_md: boolean
    data: Json
    description: string
    keywords: string
    content: string
    updated: string
}

export { Page, PAGE_TYPES, PAGE_UPDATABLE_FIELDS, PageType, PageListItem }
