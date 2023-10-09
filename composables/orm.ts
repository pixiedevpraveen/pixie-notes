import { Connector } from "indexeddb-orm/dist/connection/connector"
import { ModelKeysInterface } from "indexeddb-orm/dist/models/model.interface";
import { Model } from "indexeddb-orm/dist/models/model";

export const useOrm = (dbName: string) => {
    return new Connector({
        name: dbName,
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
                        name: 'id-action',
                        index: ['tableId', 'action'],
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
    })}

export type Models = "notes" | "contents" | "sync"

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
