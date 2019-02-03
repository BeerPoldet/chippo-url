const randomCharacter = require('./randomCharacters')

function createAlias() {
  return randomCharacter(6)
}

function toURL(maybeURL) {
  // TODO: - Fix
  if (maybeURL.startsWith('http')) {
    return maybeURL
  }
  return `http://${maybeURL}`
}

exports.upsertURLCreator = ({
  findChippoURLByAlias,
  findChippoURLByURL,
  insertURL,
}) => async chippoRequest => {
  const { alias: customAlias, url: maybeURL } = chippoRequest
  const url = toURL(maybeURL)
  if (customAlias) {
    const chippo = await findChippoURLByAlias(customAlias)
    console.log('customAlias', customAlias)
    console.log('customAlias', chippo, url)
    if (chippo) {
      if (chippo.url !== url) return undefined
      else return chippo
    }
  } else {
    const chippo = await findChippoURLByURL(url)
    if (chippo) return chippo
  }

  const alias = customAlias || createAlias()

  console.log('alias', alias)

  const result = await insertURL(alias, url)
  console.log(result)
  if (result) {
    return { alias, url }
  }
  return undefined
}
