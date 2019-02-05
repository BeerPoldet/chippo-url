const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const chippoCollection = require('./chippoCollection')

async function bootstrapDatabase(withDB) {
  return { chippo: await chippoCollection(withDB) }
}

const withDBCreator = connectDatabase => async exec => {
  const client = await connectDatabase()
  const result = await exec(client.db())
  client.close()
  return result
}

const connectDatabaseCreator = url => async () => {
  const client = new MongoClient(url, { useNewUrlParser: true })
  try {
    await client.connect()
    return client
  } catch (err) {
    console.erorr(err)
    return err
  }
}

/**
 * config: {
 *  url: String,
 *  name: String
 * }
 */
module.exports = async config => {
  const connectDatabase = await connectDatabaseCreator(config.url)
  return bootstrapDatabase(withDBCreator(connectDatabase))
}
