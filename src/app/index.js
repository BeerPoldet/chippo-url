const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// MARK: - Data source layer

function parseChippoRequest(body) {
  if (!body) return undefined
  const { alias, url } = body
  if (url) return { alias, url }
  return undefined
}

module.exports = async (
  { mode, port, rootPath },
  { findChippoURLByAlias, upsertURL },
) => {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.set('view engine', 'ejs')

  app.use('/static', express.static(path.join(rootPath, 'public')))
  app.use('/static', express.static(path.join(rootPath, 'build')))

  app.get('/', (req, res) => {
    res.render(path.join(rootPath, 'views/pages/index'), { mode })
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
      res.render(path.join(rootPath, 'views/pages/preview'), {
        mode,
        type: 'failure',
        targetURL,
        chippoURL,
      })
      return
    }
    res.render(path.join(rootPath, 'views/pages/preview'), {
      mode,
      type: 'success',
      targetURL,
      chippoURL,
    })
  })

  app.get('/:alias', async (req, res) => {
    const chippo = await findChippoURLByAlias(req.params['alias'])
    if (chippo && chippo.url) res.redirect(chippo.url)
    else res.render(path.join(rootPath, 'views/pages/notFound'), { mode })
  })

  app.post('/chippo', async (req, res) => {
    const result = await upsertURL(req.body)
    result.match(
      ({ chippo }) =>
        res.redirect(`/p?url=${chippo.url}&alias=${chippo.alias}`),
      ({ request }) => {
        if (request)
          res.redirect(`/p?url=${request.url}&alias=${request.alias}`)
        else res.redirect('/')
      },
    )
  })

  return new Promise((resolve, reject) => {
    app.listen(port, err => {
      if (err) {
        reject()
      } else {
        console.log(`Application is running at ${port}`)
        resolve()
      }
    })
  })
}
