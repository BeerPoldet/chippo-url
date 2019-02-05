const collection = db => db.collection('chippos')

const findChippoURLByAliasCreator = db => async alias => {
  if (!alias) return undefined
  return collection(db).findOne({ alias })
}

const findChippoURLByURLCreator = db => async url => {
  if (!url) return undefined
  return collection(db).findOne({ url })
}

const findChippoURLByAliasAndURLCreator = db => async (alias, url) => {
  if (!alias || !url) return undefined
  return collection(db).findOne({ alias, url })
}

const insertURLCreator = db => async (alias, url) =>
  collection(db)
    .insertOne({ alias, url })
    .then(() => true) // I just don't want to deal with this error for this challenge
    .catch(() => false)

module.exports = async db => {
  await collection(db).createIndex({ alias: 1 }, { unique: true })
  return {
    findChippoURLByAlias: findChippoURLByAliasCreator(db),
    findChippoURLByURL: findChippoURLByURLCreator(db),
    findChippoURLByAliasAndURL: findChippoURLByAliasAndURLCreator(db),
    insertURL: insertURLCreator(db),
  }
}
