const path = require('path')
const app = require('./app')

const inmemory = require('./databases/inmemory')
const mongo = require('./databases/mongo')
const chippo = require('./modules/chippo')

const mode = process.env['NODE_ENV'] || 'development'
console.log('mode: ', mode)
const port = process.env['PORT'] || 5000
const dbURL = process.env['MONGODB_URI'] || 'mongodb://localhost:27017'
const dbName = mode === 'production' ? 'chippo' : 'chippo_dev'

global.World = {
  dbRef: undefined,
}

async function main() {
  try {
    const config = { url: dbURL, name: dbName }

    const rootPath = path.join(__dirname, '../')

    // const db = await mongo(config)
    const db = await inmemory(config)

    World.db = db

    upsertURL = chippo.upsertURLCreator({
      findChippoURLByAlias: db.chippo.findChippoURLByAlias,
      findChippoURLByURL: db.chippo.findChippoURLByURL,
      insertURL: db.chippo.insertURL,
    })

    await app(
      { mode, port, rootPath },
      {
        findChippoURLByAlias: db.chippo.findChippoURLByAlias,
        upsertURL,
      },
    )
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
