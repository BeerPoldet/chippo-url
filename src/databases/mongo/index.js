const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const chippoCollection = require('./chippoCollection')

async function bootstrapDatabase(db) {
  return { chippo: await chippoCollection(db) }
}

async function connectDatabase(url) {
  const client = new MongoClient(url, { useNewUrlParser: true })

  try {
    await client.connect()
    console.log(`Connected to database via ${url}`)

    return client.db()
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
  const db = await connectDatabase(config.url)
  return {
    db,
    ...(await bootstrapDatabase(db)),
  }
}
