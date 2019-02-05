const collection = db => db.collection('chippos')

const findChippoURLByAliasCreator = withDB => async alias => {
  if (!alias) return undefined
  return withDB(db => collection(db).findOne({ alias }))
}

const findChippoURLByURLCreator = withDB => async url => {
  if (!url) return undefined
  return withDB(db => collection(db).findOne({ url }))
}

const findChippoURLByAliasAndURLCreator = withDB => async (alias, url) => {
  if (!alias || !url) return undefined
  return withDB(db => collection(db).findOne({ alias, url }))
}

const insertURLCreator = withDB => async (alias, url) =>
  withDB(db =>
    collection(db)
      .insertOne({ alias, url })
      .then(() => true) // I just don't want to deal with this error for this challenge
      .catch(() => false),
  )

module.exports = async withDB => {
  await withDB(db => collection(db).createIndex({ alias: 1 }, { unique: true }))
  return {
    findChippoURLByAlias: findChippoURLByAliasCreator(withDB),
    findChippoURLByURL: findChippoURLByURLCreator(withDB),
    findChippoURLByAliasAndURL: findChippoURLByAliasAndURLCreator(withDB),
    insertURL: insertURLCreator(withDB),
  }
}
