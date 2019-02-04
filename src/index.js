const config = require('./config')
const app = require('./app')

const inmemory = require('./databases/inmemory')
const mongo = require('./databases/mongo')

const { createChippo } = require('./modules/chippo')

async function main() {
  try {
    const db = await (config.isInMemory
      ? inmemory(config.db)
      : mongo(config.db))

    const chippo = createChippo({
      findChippoURLByAlias: db.chippo.findChippoURLByAlias,
      findChippoURLByURL: db.chippo.findChippoURLByURL,
      findChippoURLByAliasAndURL: db.chippo.findChippoURLByAliasAndURL,
      insertURL: db.chippo.insertURL,
    })

    await app(config.app, { chippo })
  } catch (err) {
    console.log(err.stack)
    process.exit(1)
  }
}

main()
