const config = require('./config')
const app = require('./app')

const inmemory = require('./databases/inmemory')
const mongo = require('./databases/mongo')

const chippo = require('./modules/chippo')

async function main() {
  try {
    const db = await (config.isInMemory
      ? inmemory(config.db)
      : mongo(config.db))

    upsertURL = chippo.upsertURLCreator({
      findChippoURLByAlias: db.chippo.findChippoURLByAlias,
      findChippoURLByURL: db.chippo.findChippoURLByURL,
      insertURL: db.chippo.insertURL,
    })

    await app(config.app, {
      findChippoURLByAlias: db.chippo.findChippoURLByAlias,
      upsertURL,
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
