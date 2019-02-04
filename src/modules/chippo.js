const { Result } = require('./result')
const randomCharacter = require('./randomCharacters')

function defaultCreateAlias() {
  return randomCharacter(6)
}

const toURL = (exports.toURL = function(maybeURL) {
  if (maybeURL.startsWith('http')) {
    return maybeURL
  }
  return `http://${maybeURL}`
})

const parseChippoRequest = (exports.parseChippoRequest = function(request) {
  if (!request || !request.url) return Result.failure({})
  const { alias, url } = request
  return Result.success({ alias, url })
})

exports.upsertURLCreator = ({
  findChippoURLByAlias,
  findChippoURLByURL,
  insertURL,
  createAlias: maybeCreateAlias,
}) => async chippoRequest => {
  const createAlias = maybeCreateAlias || defaultCreateAlias
  return parseChippoRequest(chippoRequest)
    .map(request => ({
      ...request,
      url: toURL(request.url),
    }))
    .flatMap(async request => {
      const customAlias = request.alias
      if (customAlias) {
        const chippo = await findChippoURLByAlias(customAlias)
        if (chippo && chippo.url === request.url)
          return Result.success({ chippo, request })
        else if (chippo) return Result.failure({ request })
      } else {
        const chippo = await findChippoURLByURL(request.url)
        if (chippo) return Result.success({ chippo, request })
      }

      const alias = customAlias || createAlias()

      const result = await insertURL(alias, request.url)
      if (result) {
        return Result.success({ chippo: { alias, url: request.url }, request })
      }
      return Result.failure({ request })
    })
}
