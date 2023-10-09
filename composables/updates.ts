export const useUpdates = () => ({
    settings: [
        {
            name: "Init",
            done: true,
            async action() {
            }
        },
        {
            name: "Remove databases",
            done: false,
            async action() {
                const dbs = await indexedDB.databases()
                dbs.forEach(db => {
                    if (!db.name) return

                    const remove = confirm(`Confirm remove database ${db.name} ${dbs.length}`)
                    if (remove) {
                        indexedDB.deleteDatabase(db.name)
                    }
                })
            }
        }
    ]
})
