const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const chippoCollection = require('./chippoCollection')

async function bootstrapDatabase(db) {
  return { chippo: await chippoCollection(db) }
}

async function connectDatabase(url, name) {
  const client = new MongoClient(url, { useNewUrlParser: true })

  try {
    await client.connect()
    console.log(`Connected to database via ${url}`)

    return client.db(name)
  } catch (err) {
    console.erorr(err)
  }
}

/**
 * config: {
 *  url: String,
 *  name: String
 * }
 */
module.exports = async config => {
  const db = await connectDatabase(config.url, config.name)
  return {
    db,
    ...(await bootstrapDatabase(db)),
  }
}
