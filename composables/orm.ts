import { Connector } from "indexeddb-orm/dist/connection/connector"
import { Database } from "indexeddb-orm/dist/migration/migration.interface"
import { ModelKeysInterface } from "indexeddb-orm/dist/models/model.interface";
import { Model } from "indexeddb-orm/dist/models/model";

export const useOrm = () => new Connector(settings)

export type Models = "notes" | "pages" | "contents" | "sync"

export type ModelKeys = ModelKeysInterface<Models>

class NotesTable extends Model {
    static TableName = 'notes'

    content = () => {
        return this.hasOne(ContentsTable, 'id', 'id', "content")
    }
}

class ContentsTable extends Model {
    static TableName = 'contents'
}

const settings: Database = {
    name: 'pixie',
    version: 1,
    tables: [
        {
            name: 'notes',
            primary: 'id',
            ormClass: NotesTable,
            columns: [
                {
                    name: 'title',
                    index: 'title',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'is_active',
                    index: 'is_active',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'is_locked',
                    index: 'is_locked',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'is_favourite',
                    index: 'is_favourite',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'folder',
                    index: 'folder',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'keywords',
                    index: 'keywords',
                    attributes: {
                        unique: false
                    }
                }
            ]
        },
        {
            name: 'pages',
            primary: 'id',
            columns: [
                {
                    name: 'page_type',
                    index: 'page_type',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'slug',
                    index: 'slug',
                    attributes: {
                        unique: true
                    }
                },
                {
                    name: 'is_active',
                    index: 'is_active',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'is_indexed',
                    index: 'is_indexed',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'is_public',
                    index: 'is_public',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'folder',
                    index: 'folder',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'keywords',
                    index: 'keywords',
                    attributes: {
                        unique: false
                    }
                }
            ]
        },
        {
            name: 'contents',
            primary: 'id',
            ormClass: ContentsTable,
            columns: [
                {
                    name: "table",
                    index: "table",
                    attributes: {
                        unique: false
                    }
                }
            ]
        },
        {
            name: 'sync',
            primary: 'id',
            columns: [
                {
                    name: 'action',
                    index: 'action',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'tableId',
                    index: 'tableId',
                    attributes: {
                        unique: false
                    }
                },
                {
                    name: 'table',
                    index: 'table',
                    attributes: {
                        unique: false
                    }
                }
            ]
        }
    ]
}
