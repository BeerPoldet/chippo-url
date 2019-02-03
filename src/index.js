const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const port = process.env['PORT'] || 5000

const rootPath = path.join(__dirname, '../')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(rootPath, '/public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(rootPath, '/public/index.html'))
})

app.get('/p', async (req, res) => {
  const targetURL = req.query['url']
  const alias = req.query['alias']
  if (!targetURL || !alias) {
    res.redirect('/')
    return
  }
  const chippo = await findChippoURLByAlias(alias)
  // check if url is part of target url it might not string identical
  const { url: existURL } = chippo || {}
  const chippoURL = path.join(req.headers.host, alias)
  if (!existURL || existURL !== targetURL) {
    res.send(`Your url ${targetURL} cannot be shortened to ${chippoURL}`)
    return
  }
  res.send(`Your url ${targetURL} becomes ${chippoURL}`)
})

app.get('/:alias', async (req, res) => {
  const { url } = await findChippoURLByAlias(req.params['alias'])
  if (url) res.redirect(url)
  else res.status(404).send('URL Not Found')
})

app.post('/chippo', async (req, res) => {
  const chippoRequest = parseChippoRequest(req.body)
  if (!chippoRequest) {
    res.redirect('/')
    return
  }
  const chippo = await upsertURL(chippoRequest)
  console.log('chippo', chippo)
  const url = chippo ? chippo.url : chippoRequest.url
  const alias = chippo ? chippo.alias : chippoRequest.alias
  if (!url || !alias) res.redirect(`/`)
  else res.redirect(`/p?url=${url}&alias=${alias}`)
})

app.listen(port, () => {
  console.log(`Application is running at ${port}`)
})

// MARK: - Data source layer

function parseChippoRequest(body) {
  console.log(body)
  if (!body) return undefined
  const { alias, url } = body
  if (url) return { alias, url }
  return undefined
}

const chippos = {
  aaa: 'https://google.com',
  bbb: 'https://facebook.com',
  ccc: 'https://twitter.com',
}

async function findChippoURLByAlias(alias) {
  if (!alias) return undefined
  const url = chippos[alias]
  if (!url) return undefined
  return { alias, url }
}

async function findChippoURLByURL(url) {
  if (!url) return undefined
  const alias = Object.keys(chippos).find(key => chippos[key] === url)
  if (!alias) return undefined
  return { alias, url }
}

async function insertURL(alias, url) {
  chippos[alias] = url
  return true
}

async function upsertURL(chippoRequest) {
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
  }
  const chippo = await findChippoURLByURL(url)
  if (chippo) return chippo

  const alias = customAlias || createAlias()

  console.log('alias', alias)

  const result = await insertURL(alias, url)
  if (result) {
    return { alias, url }
  }
  return undefined
}

function toURL(maybeURL) {
  // TODO: - Fix
  if (maybeURL.startsWith('http')) {
    return maybeURL
  }
  return `http://${maybeURL}`
}

function createAlias() {
  const characterSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 6 }, () =>
    characterSet.charAt(Math.floor(Math.random() * characterSet.length)),
  ).join('')
}
