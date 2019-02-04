const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const createPageRouter = require('./pageRouter')

module.exports = async ({ mode, port, rootPath }, { chippo }) => {
  const app = express()
  const pageRouter = createPageRouter(rootPath)

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.set('view engine', 'ejs')

  app.use('/static', express.static(path.join(rootPath, 'public')))
  app.use('/static', express.static(path.join(rootPath, 'build')))

  app.get('/', (req, res) => {
    res.render(pageRouter.routeFor('index'), { mode })
  })

  app.get('/p', async (req, res) => {
    const url = req.query['url']
    const alias = req.query['alias']

    const result = await chippo.isExist(alias, url)
    result
      .mapSuccess(chippo => ({
        type: 'success',
        chippo: {
          ...chippo,
          fullAlias: path.join(req.headers.host, chippo.alias)
        },
      }))
      .mapFailure(({ alias, url }) => ({
        type: 'failure',
        input: alias && url ? { alias, url } : undefined,
      }))
      .match(
        paramter => res.render(pageRouter.routeFor('preview'), paramter),
        paramter => {
          if (paramter.input)
            res.render(pageRouter.routeFor('preview'), paramter)
          else res.redirect('/')
        },
      )
  })

  app.get('/:alias', async (req, res) => {
    const result = await chippo.findByAlias(req.params['alias'])
    result.match(
      ({ alias, url }) => res.redirect(url),
      () => res.render(pageRouter.routeFor('notFound'), { mode }),
    )
  })

  app.post('/chippo', async (req, res) => {
    const result = await chippo.upsertURL(req.body)
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
