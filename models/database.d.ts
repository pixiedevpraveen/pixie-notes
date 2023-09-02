import { Json } from "./json"
import { Page } from "./page"

export interface Database {
    public: {
        Tables: {
            pages: {
                Row: Page
                Insert: {
                    created_at?: string | Date,
                    type: "page" | "post",
                    title: string,
                    slug: string,
                    intro?: string,
                    content?: string,
                    is_published?: boolean,
                    is_approved?: boolean,
                    is_deleted?: boolean,
                    likes?: bigint,
                    views?: bigint,
                    user_id?: string,
                    categories?: string[],
                    data?: Json,
                    is_markup?: boolean
                }
                Update: {
                    updated_at: string | Date,
                    type?: "page" | "post",
                    title?: string,
                    slug?: string,
                    intro?: string,
                    content?: string,
                    is_published?: boolean,
                    is_approved?: boolean,
                    is_deleted?: boolean,
                    likes?: bigint,
                    views?: bigint,
                    user_id?: string,
                    categories?: string[],
                    data?: Json,
                    is_markup?: boolean
                }
            }
        }
        Views: {}
    }
}
