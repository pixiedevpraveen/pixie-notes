export const useUpdates = () => ({
    settings: [
        {
            name: "Init",
            done: true,
            async action() {
            }
        },
        {
            name: "Remove old databases",
            done: false,
            async action() {
                const dbs = await indexedDB.databases()
                dbs.forEach(db => {
                    if (!db.name) return

                    const remove = confirm(`Confirm remove database ${db.name}`)
                    if (remove) {
                        indexedDB.deleteDatabase(db.name)
                    }
                })
            }
        }
    ]
})
